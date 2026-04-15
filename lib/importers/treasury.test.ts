import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TreasuryImporter } from "./treasury";
import { getImporter } from "./index";

describe("TreasuryImporter", () => {
  let importer: TreasuryImporter;

  beforeEach(() => {
    importer = new TreasuryImporter();
  });

  describe("constructor", () => {
    it("defaults to latest date", () => {
      const importer = new TreasuryImporter();
      expect(importer["date"]).toBe("latest");
    });

    it("accepts specific date config", () => {
      const importer = new TreasuryImporter({ date: "2024-12-31" });
      expect(importer["date"]).toBe("2024-12-31");
    });
  });

  describe("getResolvedDate", () => {
    it("returns the configured date when not 'latest'", () => {
      const importer = new TreasuryImporter({ date: "2024-12-31" });
      expect(importer.getResolvedDate()).toBe("2024-12-31");
    });

    it("returns null before fetch is called when date is 'latest'", () => {
      const importer = new TreasuryImporter();
      expect(importer.getResolvedDate()).toBeNull();
    });

    it("returns cached date after fetch resolves when date is 'latest'", async () => {
      vi.stubGlobal("fetch", vi.fn());
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [{ record_date: "2026-01-31" }] }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) });

      const importer = new TreasuryImporter();
      await importer.fetch();
      expect(importer.getResolvedDate()).toBe("2026-01-31");
      vi.restoreAllMocks();
    });
  });

  describe("getMetadata", () => {
    it("returns correct snapshotKey derived from data date", () => {
      const importer = new TreasuryImporter();
      const meta = importer.getMetadata("2026-01-31", "2026-03-01T00:00:00.000Z");
      expect(meta.snapshotKey).toBe("2026-01");
    });

    it("returns a human-readable reporting period", () => {
      const importer = new TreasuryImporter();
      const meta = importer.getMetadata("2026-01-31", "2026-03-01T00:00:00.000Z");
      expect(meta.reportingPeriod).toBe("January 2026");
    });

    it("returns the exact data date passed in", () => {
      const importer = new TreasuryImporter();
      const meta = importer.getMetadata("2025-09-30", "2025-10-15T12:00:00.000Z");
      expect(meta.dataDate).toBe("2025-09-30");
    });

    it("returns the exact importedAt timestamp passed in", () => {
      const importer = new TreasuryImporter();
      const importedAt = "2026-03-01T17:43:13.000Z";
      const meta = importer.getMetadata("2026-01-31", importedAt);
      expect(meta.importedAt).toBe(importedAt);
    });

    it("includes source name, URL, and transformation notes", () => {
      const importer = new TreasuryImporter();
      const meta = importer.getMetadata("2026-01-31", "2026-03-01T00:00:00.000Z");
      expect(meta.sourceName).toContain("Treasury");
      expect(meta.sourceUrl).toContain("fiscaldata.treasury.gov");
      expect(meta.transformationNotes.length).toBeGreaterThan(0);
    });
  });

  describe("getTargetDate", () => {
    beforeEach(() => {
      vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("uses provided date when not 'latest'", async () => {
      const importer = new TreasuryImporter({ date: "2024-12-31" });
      const date = await importer["getTargetDate"]();
      expect(date).toBe("2024-12-31");
    });

    it("calls fetchLatestDate when date is 'latest'", async () => {
      const fetch = global.fetch as ReturnType<typeof vi.fn>;
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ record_date: "2024-09-30" }],
        }),
      });

      const importer = new TreasuryImporter({ date: "latest" });
      const date = await importer["getTargetDate"]();

      expect(date).toBe("2024-09-30");
      expect(fetch).toHaveBeenCalledWith(
        "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?page[size]=1&sort=-record_date"
      );
    });

    it("returns cached date on second call", async () => {
      const fetch = global.fetch as ReturnType<typeof vi.fn>;
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ record_date: "2024-09-30" }],
        }),
      });

      const importer = new TreasuryImporter({ date: "latest" });
      await importer["getTargetDate"]();
      const date2 = await importer["getTargetDate"]();

      expect(date2).toBe("2024-09-30");
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("fetchLatestDate", () => {
    beforeEach(() => {
      vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("extracts latest record_date from API", async () => {
      const fetch = global.fetch as ReturnType<typeof vi.fn>;
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ record_date: "2024-09-30" }],
        }),
      });

      const latestDate = await importer["fetchLatestDate"]();

      expect(latestDate).toBe("2024-09-30");
      expect(fetch).toHaveBeenCalledWith(
        "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?page[size]=1&sort=-record_date"
      );
    });

    it("throws when no data available", async () => {
      const fetch = global.fetch as ReturnType<typeof vi.fn>;
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await expect(importer["fetchLatestDate"]()).rejects.toThrow("No data available from Treasury API");
    });

    it("throws on API error", async () => {
      const fetch = global.fetch as ReturnType<typeof vi.fn>;
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(importer["fetchLatestDate"]()).rejects.toThrow("API error: 500 Internal Server Error");
    });
  });

  describe("transform", () => {
    it("transforms valid revenue rows", () => {
      const data = {
        revenue: [
          {
            record_date: "2024-09-30",
            classification_desc: "Individual Income Taxes",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "1000000000",
          },
          {
            record_date: "2024-09-30",
            classification_desc: "Corporation Income Taxes",
            src_line_nbr: "2",
            current_month_rcpt_outly_amt: "500000000",
          },
        ],
        spending: [],
      };

      const result = importer.transform(data);

      expect(result).toHaveLength(2);
      expect(result.filter((r) => r.type === "income")).toHaveLength(2);
      const taxes = result.find((r) => r.category === "Individual Income Taxes");
      expect(taxes?.amount).toBe(1000000000);
    });

    it("transforms valid spending rows", () => {
      const data = {
        revenue: [],
        spending: [
          {
            record_date: "2024-09-30",
            classification_desc: "Department of Defense",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "800000000",
          },
          {
            record_date: "2024-09-30",
            classification_desc: "Department of Health and Human Services",
            src_line_nbr: "2",
            current_month_rcpt_outly_amt: "700000000",
          },
        ],
      };

      const result = importer.transform(data);

      expect(result).toHaveLength(2);
      expect(result.filter((r) => r.type === "spending")).toHaveLength(2);
    });

    it("filters revenue by allowlist", () => {
      const data = {
        revenue: [
          {
            record_date: "2024-09-30",
            classification_desc: "Individual Income Taxes",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "1000000000",
          },
          {
            record_date: "2024-09-30",
            classification_desc: "Unknown Category",
            src_line_nbr: "2",
            current_month_rcpt_outly_amt: "500000000",
          },
        ],
        spending: [],
      };

      const result = importer.transform(data);

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("Individual Income Taxes");
    });

    it("filters spending by denylist", () => {
      const data = {
        revenue: [],
        spending: [
          {
            record_date: "2024-09-30",
            classification_desc: "Department of Defense",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "800000000",
          },
          {
            record_date: "2024-09-30",
            classification_desc: "Interest",
            src_line_nbr: "2",
            current_month_rcpt_outly_amt: "100000000",
          },
          {
            record_date: "2024-09-30",
            classification_desc: "Total Outlays",
            src_line_nbr: "3",
            current_month_rcpt_outly_amt: "900000000",
          },
        ],
      };

      const result = importer.transform(data);

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("Department of Defense");
    });

    it("accumulates amounts for same category", () => {
      const data = {
        revenue: [
          {
            record_date: "2024-09-30",
            classification_desc: "Individual Income Taxes",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "500000000",
          },
          {
            record_date: "2024-09-30",
            classification_desc: "Individual Income Taxes",
            src_line_nbr: "2",
            current_month_rcpt_outly_amt: "500000000",
          },
        ],
        spending: [],
      };

      const result = importer.transform(data);

      expect(result).toHaveLength(1);
      expect(result[0].amount).toBe(1000000000);
    });

    it("handles amounts with commas", () => {
      const data = {
        revenue: [
          {
            record_date: "2024-09-30",
            classification_desc: "Individual Income Taxes",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "1,234,567,890",
          },
        ],
        spending: [],
      };

      const result = importer.transform(data);

      expect(result[0].amount).toBe(1234567890);
    });

    it("skips rows with empty category", () => {
      const data = {
        revenue: [
          {
            record_date: "2024-09-30",
            classification_desc: "",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "1000000000",
          },
          {
            record_date: "2024-09-30",
            classification_desc: "Individual Income Taxes",
            src_line_nbr: "2",
            current_month_rcpt_outly_amt: "500000000",
          },
        ],
        spending: [],
      };

      const result = importer.transform(data);

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("Individual Income Taxes");
    });

    it("skips rows with NaN amounts", () => {
      const data = {
        revenue: [
          {
            record_date: "2024-09-30",
            classification_desc: "Individual Income Taxes",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "not-a-number",
          },
          {
            record_date: "2024-09-30",
            classification_desc: "Corporation Income Taxes",
            src_line_nbr: "2",
            current_month_rcpt_outly_amt: "500000000",
          },
        ],
        spending: [
          {
            record_date: "2024-09-30",
            classification_desc: "Department of Defense",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "not-a-number",
          },
          {
            record_date: "2024-09-30",
            classification_desc: "Department of Health and Human Services",
            src_line_nbr: "2",
            current_month_rcpt_outly_amt: "700000000",
          },
        ],
      };

      const result = importer.transform(data);

      expect(result).toHaveLength(2);
      const spending = result.filter((r) => r.type === "spending");
      expect(spending).toHaveLength(1);
      expect(spending[0].category).toBe("Department of Health and Human Services");
    });

    it("rounds amounts to integers", () => {
      const data = {
        revenue: [
          {
            record_date: "2024-09-30",
            classification_desc: "Individual Income Taxes",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "1000000000.7",
          },
        ],
        spending: [],
      };

      const result = importer.transform(data);

      expect(result[0].amount).toBe(1000000001);
    });

    it("generates correct descriptions", () => {
      const data = {
        revenue: [
          {
            record_date: "2024-09-30",
            classification_desc: "Individual Income Taxes",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "1000000000",
          },
        ],
        spending: [
          {
            record_date: "2024-09-30",
            classification_desc: "Department of Defense",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "800000000",
          },
        ],
      };

      const result = importer.transform(data);

      const incomeItem = result.find((r) => r.type === "income");
      const spendingItem = result.find((r) => r.type === "spending");

      expect(incomeItem?.description).toBe("Federal revenue - Individual Income Taxes");
      expect(spendingItem?.description).toBe("Federal spending - Department of Defense");
    });
  });

  describe("fetch", () => {
    beforeEach(() => {
      vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("fetches revenue and spending data", async () => {
      const fetch = global.fetch as ReturnType<typeof vi.fn>;
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{
            record_date: "2024-09-30",
          }],
        }),
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{
            record_date: "2024-09-30",
            classification_desc: "Individual Income Taxes",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "1000000000",
          }],
        }),
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{
            record_date: "2024-09-30",
            classification_desc: "Department of Defense",
            src_line_nbr: "1",
            current_month_rcpt_outly_amt: "800000000",
          }],
        }),
      });

      const result = await importer.fetch();

      expect(result.revenue).toHaveLength(1);
      expect(result.spending).toHaveLength(1);
    });

    it("throws on API error", async () => {
      const fetch = global.fetch as ReturnType<typeof vi.fn>;
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(importer.fetch()).rejects.toThrow("API error: 500 Internal Server Error");
    });

    it("throws on spending API error", async () => {
      const fetch = global.fetch as ReturnType<typeof vi.fn>;
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              record_date: "2024-09-30",
              classification_desc: "Individual Income Taxes",
              src_line_nbr: "1",
              current_month_rcpt_outly_amt: "1000000000",
            },
          ],
        }),
      });

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(importer.fetch()).rejects.toThrow("API error: 500 Internal Server Error");
    });
  });
});

describe("getImporter", () => {
  it("returns treasury importer", () => {
    const importer = getImporter("treasury");

    expect(importer.name).toBe("treasury");
  });

  it("throws for unknown importer", () => {
    expect(() => getImporter("unknown")).toThrow("Unknown importer: unknown. Available: treasury");
  });

  it("accepts date config", () => {
    const importer = getImporter("treasury", { date: "2024-12-31" });

    expect(importer.name).toBe("treasury");
  });
});
