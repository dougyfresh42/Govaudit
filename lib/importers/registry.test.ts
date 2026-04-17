import { describe, it, expect } from "vitest";
import {
  DATASET_REGISTRY,
  DEFAULT_DATASET_ID,
  getDatasetEntry,
} from "./registry";

/** All 50 state IDs plus treasury (51 total). */
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

const EXPECTED_TOTAL = ALL_STATE_IDS.length + 1; // 50 states + treasury

describe("DATASET_REGISTRY", () => {
  it(`contains exactly ${EXPECTED_TOTAL} entries (treasury + 50 states)`, () => {
    expect(DATASET_REGISTRY).toHaveLength(EXPECTED_TOTAL);
  });

  it("includes all required datasets by id", () => {
    const ids = DATASET_REGISTRY.map((d) => d.id);
    expect(ids).toContain("treasury");
    for (const stateId of ALL_STATE_IDS) {
      expect(ids, `missing state: ${stateId}`).toContain(stateId);
    }
  });

  it("treasury is the first entry and is available", () => {
    expect(DATASET_REGISTRY[0].id).toBe("treasury");
    expect(DATASET_REGISTRY[0].isAvailable).toBe(true);
  });

  it("live importers are marked as available", () => {
    const liveIds = ["treasury", "massachusetts", "connecticut", "iowa"];
    for (const id of liveIds) {
      const entry = DATASET_REGISTRY.find((d) => d.id === id);
      expect(entry?.isAvailable, `${id} should be isAvailable: true`).toBe(true);
    }
  });

  it("all entries have non-empty displayName, description, and sourceUrl", () => {
    for (const entry of DATASET_REGISTRY) {
      expect(entry.displayName.length, `${entry.id} displayName`).toBeGreaterThan(0);
      expect(entry.description.length, `${entry.id} description`).toBeGreaterThan(0);
      expect(entry.sourceUrl.length, `${entry.id} sourceUrl`).toBeGreaterThan(0);
    }
  });

  it("all entries target March 2026 (2026-03-31) as the data date", () => {
    for (const entry of DATASET_REGISTRY) {
      expect(
        entry.targetDataDate,
        `${entry.id} should target 2026-03-31`
      ).toBe("2026-03-31");
    }
  });

  it("no entry requires a fallbackNote (March 2026 is directly targeted)", () => {
    for (const entry of DATASET_REGISTRY) {
      expect(entry.fallbackNote, `${entry.id} should not need a fallback`).toBeUndefined();
    }
  });

  it("no duplicate ids exist in the registry", () => {
    const ids = DATASET_REGISTRY.map((d) => d.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe("DEFAULT_DATASET_ID", () => {
  it("is 'treasury'", () => {
    expect(DEFAULT_DATASET_ID).toBe("treasury");
  });
});

describe("getDatasetEntry", () => {
  it("returns the correct entry for a known id", () => {
    const entry = getDatasetEntry("ohio");
    expect(entry).toBeDefined();
    expect(entry?.id).toBe("ohio");
    expect(entry?.displayName).toBe("Ohio");
  });

  it("returns undefined for an unknown id", () => {
    expect(getDatasetEntry("unknown-state")).toBeUndefined();
  });

  it("returns the treasury entry for 'treasury'", () => {
    const entry = getDatasetEntry("treasury");
    expect(entry?.id).toBe("treasury");
    expect(entry?.isAvailable).toBe(true);
  });

  it("returns entries for multi-word state ids", () => {
    const multiWordIds = [
      "new-york", "new-jersey", "new-hampshire", "new-mexico",
      "north-carolina", "north-dakota", "south-carolina", "south-dakota",
      "west-virginia", "rhode-island",
    ];
    for (const id of multiWordIds) {
      const entry = getDatasetEntry(id);
      expect(entry, `getDatasetEntry('${id}') should return an entry`).toBeDefined();
      expect(entry?.id).toBe(id);
    }
  });
});
