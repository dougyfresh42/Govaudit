import { describe, it, expect } from "vitest";
import {
  DATASET_REGISTRY,
  DEFAULT_DATASET_ID,
  getDatasetEntry,
} from "./registry";

describe("DATASET_REGISTRY", () => {
  it("contains exactly six entries", () => {
    expect(DATASET_REGISTRY).toHaveLength(6);
  });

  it("includes all required datasets by id", () => {
    const ids = DATASET_REGISTRY.map((d) => d.id);
    expect(ids).toContain("treasury");
    expect(ids).toContain("ohio");
    expect(ids).toContain("washington");
    expect(ids).toContain("massachusetts");
    expect(ids).toContain("connecticut");
    expect(ids).toContain("florida");
  });

  it("treasury is the first entry and is available", () => {
    expect(DATASET_REGISTRY[0].id).toBe("treasury");
    expect(DATASET_REGISTRY[0].isAvailable).toBe(true);
  });

  it("treasury, ohio, and massachusetts are marked as available", () => {
    const availableIds = ["treasury", "ohio", "massachusetts"];
    for (const id of availableIds) {
      const entry = DATASET_REGISTRY.find((d) => d.id === id);
      expect(entry?.isAvailable, `${id} should be isAvailable: true`).toBe(true);
    }
  });

  it("washington, connecticut, and florida are marked as coming-soon (not yet available)", () => {
    const comingSoonIds = ["washington", "connecticut", "florida"];
    for (const id of comingSoonIds) {
      const entry = DATASET_REGISTRY.find((d) => d.id === id);
      expect(entry?.isAvailable, `${id} should be isAvailable: false`).toBe(false);
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
      // fallbackNote is only set when the source cannot provide March 2026 directly
      expect(entry.fallbackNote, `${entry.id} should not need a fallback`).toBeUndefined();
    }
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
});
