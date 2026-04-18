/**
 * North Dakota state budget importer — stub / scaffolding.
 *
 * Data source: North Dakota Office of Management and Budget
 *   (https://www.nd.gov/omb/)
 *
 * Limitations / research notes:
 *   North Dakota OMB publishes budget data as PDFs.
 *   Tried: (1) data.nd.gov (does not exist as Socrata), (2) Socrata discovery, (3) nd.gov/omb, (4) ND Tax Commissioner, (5) nd.gov/fiscal-transparency.
 *   No machine-readable monthly API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer north-dakota --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const NORTH_DAKOTA_DATASET_ID = "north-dakota";
const NORTH_DAKOTA_SOURCE_NAME = "North Dakota Office of Management and Budget";
const NORTH_DAKOTA_SOURCE_URL = "https://www.nd.gov/omb/";
const NORTH_DAKOTA_TRANSFORMATION_NOTES =
  "STUB: North Dakota fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class NorthDakotaImporter implements Importer {
  name = NORTH_DAKOTA_DATASET_ID;
  description = "North Dakota State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: NORTH_DAKOTA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: NORTH_DAKOTA_SOURCE_NAME,
      sourceUrl: NORTH_DAKOTA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: NORTH_DAKOTA_TRANSFORMATION_NOTES,
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
