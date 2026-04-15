import { describe, it, expect } from "vitest";
import { OhioImporter, OHIO_MARCH_2026_DATE } from "./ohio";
import { WashingtonImporter, WASHINGTON_MARCH_2026_DATE } from "./washington";
import { MassachusettsImporter, MASSACHUSETTS_MARCH_2026_DATE } from "./massachusetts";
import { ConnecticutImporter, CONNECTICUT_MARCH_2026_DATE } from "./connecticut";
import { FloridaImporter, FLORIDA_MARCH_2026_DATE } from "./florida";
import { getImporter } from "./index";

// ── Shared helper ──────────────────────────────────────────────────────────

const IMPORTED_AT = "2026-04-15T00:00:00.000Z";

function assertMarch2026Meta(
  meta: ReturnType<OhioImporter["getMetadata"]>,
  expectedDatasetId: string,
  expectedSourceNameFragment: string
) {
  expect(meta.datasetId).toBe(expectedDatasetId);
  expect(meta.snapshotKey).toBe("2026-03");
  expect(meta.reportingPeriod).toBe("March 2026");
  expect(meta.dataDate).toBe("2026-03-31");
  expect(meta.importedAt).toBe(IMPORTED_AT);
  expect(meta.sourceName).toContain(expectedSourceNameFragment);
  expect(meta.sourceUrl.length).toBeGreaterThan(0);
  expect(meta.transformationNotes.length).toBeGreaterThan(0);
}

// ── Ohio ───────────────────────────────────────────────────────────────────

describe("OhioImporter", () => {
  it("exports OHIO_MARCH_2026_DATE as 2026-03-31", () => {
    expect(OHIO_MARCH_2026_DATE).toBe("2026-03-31");
  });

  it("defaults to March 2026 target date", () => {
    const imp = new OhioImporter();
    expect(imp.getResolvedDate()).toBe("2026-03-31");
  });

  it("accepts a custom date config", () => {
    const imp = new OhioImporter({ date: "2026-01-31" });
    expect(imp.getResolvedDate()).toBe("2026-01-31");
  });

  it("getMetadata returns correct March 2026 provenance", () => {
    const imp = new OhioImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    assertMarch2026Meta(meta, "ohio", "Ohio");
  });

  it("getMetadata transformation notes do not contain STUB or TODO markers", () => {
    const imp = new OhioImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    expect(meta.transformationNotes).not.toMatch(/STUB|TODO/i);
  });

  it("transform produces income and spending items from well-formed data", () => {
    const imp = new OhioImporter();
    const result = imp.transform({
      revenue: [
        { revenue_source: "Individual Income Tax", monthly_amount: "920000000", fiscal_year: "2026", fiscal_period: "9" },
        { revenue_source: "Sales and Use Tax", monthly_amount: "1082000000", fiscal_year: "2026", fiscal_period: "9" },
      ],
      expenditure: [
        { agency_name: "Ohio Dept. of Medicaid", total_expenditures: "2350000000", fiscal_year: "2026", fiscal_period: "9" },
        { agency_name: "Dept. of Education", total_expenditures: "875000000", fiscal_year: "2026", fiscal_period: "9" },
      ],
    });
    expect(result.filter((r) => r.type === "income")).toHaveLength(2);
    expect(result.filter((r) => r.type === "spending")).toHaveLength(2);
    const incomeTax = result.find((r) => r.category === "Individual Income Tax");
    expect(incomeTax?.amount).toBe(920000000);
  });

  it("transform aggregates multiple rows for the same agency", () => {
    const imp = new OhioImporter();
    const result = imp.transform({
      revenue: [],
      expenditure: [
        { agency_name: "Dept. of Education", total_expenditures: "500000000", fiscal_year: "2026", fiscal_period: "9" },
        { agency_name: "Dept. of Education", total_expenditures: "375000000", fiscal_year: "2026", fiscal_period: "9" },
      ],
    });
    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(875000000);
  });

  it("transform skips rows with zero or negative amounts", () => {
    const imp = new OhioImporter();
    const result = imp.transform({
      revenue: [
        { revenue_source: "Individual Income Tax", monthly_amount: "0", fiscal_year: "2026", fiscal_period: "9" },
        { revenue_source: "Sales and Use Tax", monthly_amount: "1082000000", fiscal_year: "2026", fiscal_period: "9" },
      ],
      expenditure: [],
    });
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("Sales and Use Tax");
  });

  it("transform returns empty array when both sources are empty", () => {
    const imp = new OhioImporter();
    expect(imp.transform({ revenue: [], expenditure: [] })).toEqual([]);
  });

  it("is registered in getImporter", () => {
    expect(getImporter("ohio").name).toBe("ohio");
  });
});

// ── Washington ─────────────────────────────────────────────────────────────

describe("WashingtonImporter", () => {
  it("exports WASHINGTON_MARCH_2026_DATE as 2026-03-31", () => {
    expect(WASHINGTON_MARCH_2026_DATE).toBe("2026-03-31");
  });

  it("defaults to March 2026 target date", () => {
    const imp = new WashingtonImporter();
    expect(imp.getResolvedDate()).toBe("2026-03-31");
  });

  it("getMetadata returns correct March 2026 provenance", () => {
    const imp = new WashingtonImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    assertMarch2026Meta(meta, "washington", "Washington");
  });

  it("fetch returns a value without throwing (stub)", async () => {
    const imp = new WashingtonImporter();
    await expect(imp.fetch()).resolves.toBeDefined();
  });

  it("transform returns an empty array (stub, not yet implemented)", () => {
    const imp = new WashingtonImporter();
    expect(imp.transform({})).toEqual([]);
  });

  it("is registered in getImporter", () => {
    expect(getImporter("washington").name).toBe("washington");
  });
});

// ── Massachusetts ──────────────────────────────────────────────────────────

describe("MassachusettsImporter", () => {
  it("exports MASSACHUSETTS_MARCH_2026_DATE as 2026-03-31", () => {
    expect(MASSACHUSETTS_MARCH_2026_DATE).toBe("2026-03-31");
  });

  it("defaults to March 2026 target date", () => {
    const imp = new MassachusettsImporter();
    expect(imp.getResolvedDate()).toBe("2026-03-31");
  });

  it("getMetadata returns correct March 2026 provenance", () => {
    const imp = new MassachusettsImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    assertMarch2026Meta(meta, "massachusetts", "Massachusetts");
  });

  it("getMetadata transformation notes do not contain STUB or TODO markers", () => {
    const imp = new MassachusettsImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    expect(meta.transformationNotes).not.toMatch(/STUB|TODO/i);
  });

  it("transform produces income and spending items from well-formed data", () => {
    const imp = new MassachusettsImporter();
    const result = imp.transform({
      revenue: [
        { revenue_type: "Income Tax", monthly_collections: "2150000000" },
        { revenue_type: "Sales and Use Tax", monthly_collections: "715000000" },
      ],
      expenditure: [
        { department_name: "MassHealth", total_expenditure: "2200000000" },
        { department_name: "Elementary and Secondary Education", total_expenditure: "815000000" },
      ],
    });
    expect(result.filter((r) => r.type === "income")).toHaveLength(2);
    expect(result.filter((r) => r.type === "spending")).toHaveLength(2);
    const incomeTax = result.find((r) => r.category === "Income Tax");
    expect(incomeTax?.amount).toBe(2150000000);
  });

  it("transform skips revenue rows with zero or negative amounts", () => {
    const imp = new MassachusettsImporter();
    const result = imp.transform({
      revenue: [
        { revenue_type: "Income Tax", monthly_collections: "0" },
        { revenue_type: "Sales and Use Tax", monthly_collections: "715000000" },
      ],
      expenditure: [],
    });
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("Sales and Use Tax");
  });

  it("transform returns empty array when both sources are empty", () => {
    const imp = new MassachusettsImporter();
    expect(imp.transform({ revenue: [], expenditure: [] })).toEqual([]);
  });

  it("is registered in getImporter", () => {
    expect(getImporter("massachusetts").name).toBe("massachusetts");
  });
});

// ── Connecticut ────────────────────────────────────────────────────────────

describe("ConnecticutImporter", () => {
  it("exports CONNECTICUT_MARCH_2026_DATE as 2026-03-31", () => {
    expect(CONNECTICUT_MARCH_2026_DATE).toBe("2026-03-31");
  });

  it("defaults to March 2026 target date", () => {
    const imp = new ConnecticutImporter();
    expect(imp.getResolvedDate()).toBe("2026-03-31");
  });

  it("getMetadata returns correct March 2026 provenance", () => {
    const imp = new ConnecticutImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    assertMarch2026Meta(meta, "connecticut", "CT");
  });

  it("fetch returns a value without throwing (stub)", async () => {
    const imp = new ConnecticutImporter();
    await expect(imp.fetch()).resolves.toBeDefined();
  });

  it("transform returns an empty array (stub, not yet implemented)", () => {
    const imp = new ConnecticutImporter();
    expect(imp.transform({})).toEqual([]);
  });

  it("is registered in getImporter", () => {
    expect(getImporter("connecticut").name).toBe("connecticut");
  });
});

// ── Florida ────────────────────────────────────────────────────────────────

describe("FloridaImporter", () => {
  it("exports FLORIDA_MARCH_2026_DATE as 2026-03-31", () => {
    expect(FLORIDA_MARCH_2026_DATE).toBe("2026-03-31");
  });

  it("defaults to March 2026 target date", () => {
    const imp = new FloridaImporter();
    expect(imp.getResolvedDate()).toBe("2026-03-31");
  });

  it("getMetadata returns correct March 2026 provenance", () => {
    const imp = new FloridaImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    assertMarch2026Meta(meta, "florida", "Florida");
  });

  it("fetch returns a value without throwing (stub)", async () => {
    const imp = new FloridaImporter();
    await expect(imp.fetch()).resolves.toBeDefined();
  });

  it("transform returns an empty array (stub, not yet implemented)", () => {
    const imp = new FloridaImporter();
    expect(imp.transform({})).toEqual([]);
  });

  it("is registered in getImporter", () => {
    expect(getImporter("florida").name).toBe("florida");
  });
});

// ── Registry completeness ──────────────────────────────────────────────────

describe("getImporter — state importers", () => {
  const stateIds = ["ohio", "washington", "massachusetts", "connecticut", "florida"];

  it("all five state importers are accessible by id", () => {
    for (const id of stateIds) {
      const imp = getImporter(id);
      expect(imp.name).toBe(id);
    }
  });

  it("error message lists all six importers when an unknown name is requested", () => {
    expect(() => getImporter("unknown")).toThrow(/treasury.*ohio.*washington.*massachusetts.*connecticut.*florida/i);
  });
});
