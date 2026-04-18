import { describe, it, expect } from "vitest";
import { getImporter, listImporters } from "./index";
import { OhioImporter } from "./ohio";
import { WashingtonImporter } from "./washington";
import { MassachusettsImporter } from "./massachusetts";
import { ConnecticutImporter } from "./connecticut";
import { FloridaImporter } from "./florida";
import { IowaImporter } from "./iowa";

// ── Shared helper ──────────────────────────────────────────────────────────

const IMPORTED_AT = "2026-04-15T00:00:00.000Z";

function assertMarch2026Meta(
  meta: ReturnType<OhioImporter["getMetadata"]>,
  expectedDatasetId: string,
  expectedSourceNameFragment: string,
  expectedDataStatus: "pulled" | "stub" = "stub"
) {
  expect(meta.datasetId).toBe(expectedDatasetId);
  expect(meta.dataStatus).toBe(expectedDataStatus);
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
    assertMarch2026Meta(meta, "ohio", "Ohio", "stub");
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

  it("transform skips expenditure agencies with zero or negative aggregate totals", () => {
    const imp = new OhioImporter();
    const result = imp.transform({
      revenue: [],
      expenditure: [
        { agency_name: "Dept. of Education", total_expenditures: "875000000", fiscal_year: "2026", fiscal_period: "9" },
        { agency_name: "Returned Funds Agency", total_expenditures: "-50000000", fiscal_year: "2026", fiscal_period: "9" },
        { agency_name: "Zero Agency", total_expenditures: "0", fiscal_year: "2026", fiscal_period: "9" },
      ],
    });
    const agencies = result.map((r) => r.category);
    expect(agencies).toContain("Dept. of Education");
    expect(agencies).not.toContain("Returned Funds Agency");
    expect(agencies).not.toContain("Zero Agency");
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
  it("defaults to March 2026 target date", () => {
    const imp = new WashingtonImporter();
    expect(imp.getResolvedDate()).toBe("2026-03-31");
  });

  it("getMetadata returns correct March 2026 provenance", () => {
    const imp = new WashingtonImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    assertMarch2026Meta(meta, "washington", "Washington", "stub");
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
  it("defaults to March 2026 target date", () => {
    const imp = new MassachusettsImporter();
    expect(imp.getResolvedDate()).toBe("2026-03-31");
  });

  it("getMetadata returns correct March 2026 provenance", () => {
    const imp = new MassachusettsImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    assertMarch2026Meta(meta, "massachusetts", "Massachusetts", "pulled");
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

  it("transform skips expenditure departments with zero or negative amounts", () => {
    const imp = new MassachusettsImporter();
    const result = imp.transform({
      revenue: [],
      expenditure: [
        { department_name: "MassHealth", total_expenditure: "2200000000" },
        { department_name: "Adjustment Account", total_expenditure: "-500000" },
        { department_name: "Zero Dept", total_expenditure: "0" },
      ],
    });
    const depts = result.map((r) => r.category);
    expect(depts).toContain("MassHealth");
    expect(depts).not.toContain("Adjustment Account");
    expect(depts).not.toContain("Zero Dept");
  });

  it("transform returns empty array when both sources are empty", () => {
    const imp = new MassachusettsImporter();
    expect(imp.transform({ revenue: [], expenditure: [] })).toEqual([]);
  });

  it("is registered in getImporter", () => {
    expect(getImporter("massachusetts").name).toBe("massachusetts");
  });
});

// ── Connecticut (LIVE) ────────────────────────────────────────────────────

describe("ConnecticutImporter", () => {
  it("defaults to March 2026 target date", () => {
    const imp = new ConnecticutImporter();
    expect(imp.getResolvedDate()).toBe("2026-03-31");
  });

  it("accepts a custom date config", () => {
    const imp = new ConnecticutImporter({ date: "2026-01-31" });
    expect(imp.getResolvedDate()).toBe("2026-01-31");
  });

  it("getMetadata returns correct March 2026 provenance", () => {
    const imp = new ConnecticutImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    assertMarch2026Meta(meta, "connecticut", "Connecticut", "pulled");
  });

  it("getMetadata transformation notes do not contain STUB or TODO markers", () => {
    const imp = new ConnecticutImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    expect(meta.transformationNotes).not.toMatch(/STUB|TODO/i);
  });

  it("transform produces income items from revenue data", () => {
    const imp = new ConnecticutImporter();
    const result = imp.transform({
      revenue: [{
        month: "March",
        calendar_year: "2026",
        fiscal_year: "FY 2025-26",
        withholding: "1119971512.13",
        sales_and_use: "581797608.19",
        corporation_business: "188735467.09",
      }],
      expenditure: [],
    });
    const income = result.filter((r) => r.type === "income");
    expect(income.length).toBeGreaterThanOrEqual(3);
    const withholding = income.find((r) => r.category === "Withholding Tax");
    expect(withholding?.amount).toBe(1119971512);
  });

  it("transform produces spending items from expenditure data", () => {
    const imp = new ConnecticutImporter();
    const result = imp.transform({
      revenue: [],
      expenditure: [
        { department: "Dept. of Social Services", total: "500000000" },
        { department: "Dept. of Education", total: "300000000" },
      ],
    });
    const spending = result.filter((r) => r.type === "spending");
    expect(spending).toHaveLength(2);
  });

  it("transform skips revenue columns with zero or negative amounts", () => {
    const imp = new ConnecticutImporter();
    const result = imp.transform({
      revenue: [{
        month: "March",
        calendar_year: "2026",
        fiscal_year: "FY 2025-26",
        withholding: "0",
        sales_and_use: "-100",
        corporation_business: "188735467.09",
      }],
      expenditure: [],
    });
    const cats = result.map((r) => r.category);
    expect(cats).not.toContain("Withholding Tax");
    expect(cats).not.toContain("Sales and Use Tax");
    expect(cats).toContain("Corporation Business Tax");
  });

  it("transform returns empty array when both sources are empty", () => {
    const imp = new ConnecticutImporter();
    expect(imp.transform({ revenue: [], expenditure: [] })).toEqual([]);
  });

  it("is registered in getImporter", () => {
    expect(getImporter("connecticut").name).toBe("connecticut");
  });
});

// ── Florida ────────────────────────────────────────────────────────────────

describe("FloridaImporter", () => {
  it("defaults to March 2026 target date", () => {
    const imp = new FloridaImporter();
    expect(imp.getResolvedDate()).toBe("2026-03-31");
  });

  it("getMetadata returns correct March 2026 provenance", () => {
    const imp = new FloridaImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    assertMarch2026Meta(meta, "florida", "Florida", "stub");
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

// ── Iowa (LIVE) ────────────────────────────────────────────────────────────

describe("IowaImporter", () => {
  it("defaults to March 2026 target date", () => {
    const imp = new IowaImporter();
    expect(imp.getResolvedDate()).toBe("2026-03-31");
  });

  it("accepts a custom date config", () => {
    const imp = new IowaImporter({ date: "2026-01-31" });
    expect(imp.getResolvedDate()).toBe("2026-01-31");
  });

  it("getMetadata returns correct March 2026 provenance", () => {
    const imp = new IowaImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    assertMarch2026Meta(meta, "iowa", "Iowa", "pulled");
  });

  it("getMetadata transformation notes do not contain STUB or TODO markers", () => {
    const imp = new IowaImporter();
    const meta = imp.getMetadata("2026-03-31", IMPORTED_AT);
    expect(meta.transformationNotes).not.toMatch(/STUB|TODO/i);
  });

  it("transform produces income items from revenue data (amounts in millions)", () => {
    const imp = new IowaImporter();
    const result = imp.transform({
      revenue: [{
        fiscal_year: "2026",
        fiscal_month: "9-Mar",
        receipts_individual_income_tax_withholding: "249.67",
        receipts_individual_income_tax_estimate_payments: "-24.19",
        receipts_individual_income_tax_returns: "84.56",
        receipts_sales_tax: "343.84",
        refunds_individual_income_tax: "220.68",
        refunds_sales_tax: "3.65",
      }],
      expenditure: [],
    });
    const income = result.filter((r) => r.type === "income");
    expect(income.length).toBeGreaterThanOrEqual(1);
    // Net individual income = (249.67 - 24.19 + 84.56) - 220.68 = 89.36M
    const incomeTax = income.find((r) => r.category === "Individual Income Tax");
    expect(incomeTax).toBeDefined();
    expect(incomeTax!.amount).toBe(89360000);
    // Net sales = 343.84 - 3.65 = 340.19M
    const salesTax = income.find((r) => r.category === "Sales Tax");
    expect(salesTax).toBeDefined();
    expect(salesTax!.amount).toBe(340190000);
  });

  it("transform produces spending items from expenditure data", () => {
    const imp = new IowaImporter();
    const result = imp.transform({
      revenue: [],
      expenditure: [
        { department: "HEALTH AND HUMAN SERVICES, DEPARTMENT OF", total: "1310594771.85" },
        { department: "EDUCATION, DEPT OF", total: "462004053.79" },
      ],
    });
    const spending = result.filter((r) => r.type === "spending");
    expect(spending).toHaveLength(2);
    expect(spending[0].amount).toBe(1310594772); // rounded
  });

  it("transform skips negative-net revenue categories", () => {
    const imp = new IowaImporter();
    const result = imp.transform({
      revenue: [{
        fiscal_year: "2026",
        fiscal_month: "9-Mar",
        receipts_individual_income_tax_withholding: "100",
        refunds_individual_income_tax: "200",
      }],
      expenditure: [],
    });
    // Net = 100 - 200 = -100M → should be excluded
    expect(result.filter((r) => r.category === "Individual Income Tax")).toHaveLength(0);
  });

  it("transform returns empty array when both sources are empty", () => {
    const imp = new IowaImporter();
    expect(imp.transform({ revenue: [], expenditure: [] })).toEqual([]);
  });

  it("is registered in getImporter", () => {
    expect(getImporter("iowa").name).toBe("iowa");
  });
});

// ── All state importers via getImporter ────────────────────────────────────

describe("getImporter — all state importers", () => {
  const ALL_STATE_IDS = [
    "alabama", "alaska", "arizona", "arkansas", "california",
    "colorado", "connecticut", "delaware", "florida", "georgia",
    "hawaii", "idaho", "illinois", "indiana", "iowa",
    "kansas", "kentucky", "louisiana", "maine", "maryland",
    "massachusetts", "michigan", "minnesota", "mississippi", "missouri",
    "montana", "nebraska", "nevada", "new-hampshire", "new-jersey",
    "new-mexico", "new-york", "north-carolina", "north-dakota", "ohio",
    "oklahoma", "oregon", "pennsylvania", "rhode-island", "south-carolina",
    "south-dakota", "tennessee", "texas", "utah", "vermont",
    "virginia", "washington", "west-virginia", "wisconsin", "wyoming",
  ];

  it("all 50 state importers are accessible by id", () => {
    for (const id of ALL_STATE_IDS) {
      const imp = getImporter(id);
      expect(imp.name, `getImporter('${id}').name should be '${id}'`).toBe(id);
    }
  });

  it("all state importers accept a custom date config", () => {
    for (const id of ALL_STATE_IDS) {
      const imp = getImporter(id, { date: "2026-02-28" });
      expect(imp.getResolvedDate?.()).toBe("2026-02-28");
    }
  });

  it("all state importers return valid metadata", () => {
    for (const id of ALL_STATE_IDS) {
      const imp = getImporter(id);
      const meta = imp.getMetadata?.("2026-03-31", IMPORTED_AT);
      expect(meta, `${id} should return metadata`).toBeDefined();
      expect(meta!.datasetId).toBe(id);
      expect(meta!.snapshotKey).toBe("2026-03");
      expect(meta!.dataDate).toBe("2026-03-31");
      expect(meta!.sourceName.length).toBeGreaterThan(0);
      expect(meta!.sourceUrl.length).toBeGreaterThan(0);
      expect(["pulled", "stub"]).toContain(meta!.dataStatus);
    }
  });

  it("stub importers return empty from transform", () => {
    // Importers with typed transform signatures (revenue/expenditure) need proper empty input.
    // Stubs with untyped _data: unknown accept {}.
    const TYPED_STUBS = ["ohio", "massachusetts"];
    const STUB_IDS = ALL_STATE_IDS.filter(
      (id) => !["massachusetts", "connecticut", "iowa"].includes(id)
    );
    for (const id of STUB_IDS) {
      const imp = getImporter(id);
      const input = TYPED_STUBS.includes(id)
        ? { revenue: [], expenditure: [] }
        : {};
      const result = imp.transform(input);
      expect(result, `${id} stub should return []`).toEqual([]);
    }
  });

  it("error message lists importers when an unknown name is requested", () => {
    expect(() => getImporter("unknown")).toThrow(/Unknown importer/);
  });

  it("listImporters returns 51 total importers (treasury + 50 states)", () => {
    const all = listImporters();
    expect(all).toHaveLength(51);
  });
});
