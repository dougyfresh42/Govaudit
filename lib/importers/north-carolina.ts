/**
 * North Carolina state budget importer — stub / scaffolding.
 *
 * Data source: North Carolina Transparency
 *   (https://www.nc.gov/transparency)
 *
 * Limitations / research notes:
 *   North Carolina's transparency portal uses a custom interface.
 *   Tried: (1) data.nc.gov (no fiscal datasets), (2) Socrata discovery, (3) nc.gov/transparency, (4) NC Office of State Budget and Management, (5) NC Department of Revenue.
 *   No monthly Socrata API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer north-carolina --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const NORTH_CAROLINA_DATASET_ID = "north-carolina";
const NORTH_CAROLINA_SOURCE_NAME = "North Carolina Transparency";
const NORTH_CAROLINA_SOURCE_URL = "https://www.nc.gov/transparency";
const NORTH_CAROLINA_TRANSFORMATION_NOTES =
  "STUB: North Carolina fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class NorthCarolinaImporter implements Importer {
  name = NORTH_CAROLINA_DATASET_ID;
  description = "North Carolina State Budget — monthly revenue and expenditure (stub)";

  private date: string;

  constructor(config?: ImporterConfig) {
    this.date = config?.date || DEFAULT_DATE;
  }

  /** Returns the target data date. */
  getResolvedDate(): string {
    return this.date;
  }

  getMetadata(resolvedDate: string, importedAt: string): SnapshotMeta {
    const [year, month] = resolvedDate.split("-");
    const snapshotKey = `${year}-${month}`;
    const reportingPeriod = new Date(`${resolvedDate}T12:00:00Z`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      timeZone: "UTC",
    });
    return {
      datasetId: NORTH_CAROLINA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: NORTH_CAROLINA_SOURCE_NAME,
      sourceUrl: NORTH_CAROLINA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: NORTH_CAROLINA_TRANSFORMATION_NOTES,
    };
  }

  async fetch(): Promise<unknown> {
    // Stub: no data source API implemented yet.
    return {};
  }

  transform(_data: unknown): BudgetItem[] {
    // Stub: returns empty array until a data source is integrated.
    return [];
  }
}
