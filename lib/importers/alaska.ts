/**
 * Alaska state budget importer — stub / scaffolding.
 *
 * Data source: Alaska Office of Management and Budget
 *   (https://omb.alaska.gov/)
 *
 * Limitations / research notes:
 *   Alaska OMB publishes budget documents as PDFs.
 *   No public REST API or Socrata portal found for monthly revenue/expenditure data.
 *   Tried: (1) omb.alaska.gov, (2) data.alaska.gov (does not exist), (3) Socrata discovery, (4) Alaska Department of Revenue site, (5) opendata.alaska.gov.
 *   No machine-readable monthly fiscal data available.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer alaska --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const ALASKA_DATASET_ID = "alaska";
const ALASKA_SOURCE_NAME = "Alaska Office of Management and Budget";
const ALASKA_SOURCE_URL = "https://omb.alaska.gov/";
const ALASKA_TRANSFORMATION_NOTES =
  "STUB: Alaska fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class AlaskaImporter implements Importer {
  name = ALASKA_DATASET_ID;
  description = "Alaska State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: ALASKA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: ALASKA_SOURCE_NAME,
      sourceUrl: ALASKA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: ALASKA_TRANSFORMATION_NOTES,
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
