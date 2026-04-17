/**
 * Rhode Island state budget importer — stub / scaffolding.
 *
 * Data source: Rhode Island Transparency Portal
 *   (https://transparency.ri.gov/)
 *
 * Limitations / research notes:
 *   Rhode Island Transparency portal uses a custom web interface.
 *   Tried: (1) data.ri.gov (no fiscal datasets found), (2) Socrata discovery, (3) transparency.ri.gov, (4) RI Office of Management and Budget, (5) RI Division of Taxation.
 *   No Socrata monthly fiscal API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer rhode-island --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const RHODE_ISLAND_DATASET_ID = "rhode-island";
const RHODE_ISLAND_SOURCE_NAME = "Rhode Island Transparency Portal";
const RHODE_ISLAND_SOURCE_URL = "https://transparency.ri.gov/";
const RHODE_ISLAND_TRANSFORMATION_NOTES =
  "STUB: Rhode Island fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class RhodeIslandImporter implements Importer {
  name = RHODE_ISLAND_DATASET_ID;
  description = "Rhode Island State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: RHODE_ISLAND_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: RHODE_ISLAND_SOURCE_NAME,
      sourceUrl: RHODE_ISLAND_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: RHODE_ISLAND_TRANSFORMATION_NOTES,
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
