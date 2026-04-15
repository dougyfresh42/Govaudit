import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DataSourceInfo from "./DataSourceInfo";
import type { SnapshotMeta } from "@/lib/importers/types";

const sampleMeta: SnapshotMeta = {
  snapshotKey: "2026-01",
  datasetId: "treasury",
  sourceName: "U.S. Treasury Monthly Treasury Statement (MTS)",
  sourceUrl: "https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/",
  reportingPeriod: "January 2026",
  dataDate: "2026-01-31",
  importedAt: "2026-03-01T17:43:13.000Z",
  transformationNotes: "Revenue from MTS Table 9; Spending from MTS Table 3.",
};

describe("DataSourceInfo", () => {
  it("renders the source name as a link", () => {
    render(<DataSourceInfo meta={sampleMeta} />);
    const link = screen.getByRole("link", { name: sampleMeta.sourceName });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe(sampleMeta.sourceUrl);
  });

  it("renders the reporting period", () => {
    render(<DataSourceInfo meta={sampleMeta} />);
    expect(screen.getByText(/January 2026/)).toBeTruthy();
  });

  it("renders the data date", () => {
    render(<DataSourceInfo meta={sampleMeta} />);
    expect(screen.getByText(/2026-01-31/)).toBeTruthy();
  });

  it("renders the transformation notes", () => {
    render(<DataSourceInfo meta={sampleMeta} />);
    expect(screen.getByText(/Revenue from MTS Table 9/)).toBeTruthy();
  });

  it("renders a human-readable imported date", () => {
    render(<DataSourceInfo meta={sampleMeta} />);
    // "March 1, 2026" from 2026-03-01T17:43:13.000Z UTC
    expect(screen.getByText(/March 1, 2026/)).toBeTruthy();
  });
});
