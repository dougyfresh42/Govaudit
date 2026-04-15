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

  it("fetch returns a value without throwing (stub)", async () => {
    const imp = new OhioImporter();
    const result = await imp.fetch();
    expect(result).toBeDefined();
  });

  it("transform returns an empty array (stub, not yet implemented)", () => {
    const imp = new OhioImporter();
    expect(imp.transform({})).toEqual([]);
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

  it("fetch returns a value without throwing (stub)", async () => {
    const imp = new MassachusettsImporter();
    await expect(imp.fetch()).resolves.toBeDefined();
  });

  it("transform returns an empty array (stub, not yet implemented)", () => {
    const imp = new MassachusettsImporter();
    expect(imp.transform({})).toEqual([]);
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
