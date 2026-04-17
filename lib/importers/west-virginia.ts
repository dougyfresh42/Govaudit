/**
 * West Virginia state budget importer — stub / scaffolding.
 *
 * Data source: West Virginia State Auditor / Finance
 *   (https://finance.wv.gov/)
 *
 * Limitations / research notes:
 *   West Virginia does not have a Socrata open data portal for fiscal data.
 *   Tried: (1) data.wv.gov (does not exist), (2) Socrata discovery, (3) finance.wv.gov, (4) WV State Auditor transparency, (5) tax.wv.gov.
 *   No machine-readable monthly API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer west-virginia --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const WEST_VIRGINIA_DATASET_ID = "west-virginia";
const WEST_VIRGINIA_SOURCE_NAME = "West Virginia State Auditor / Finance";
const WEST_VIRGINIA_SOURCE_URL = "https://finance.wv.gov/";
const WEST_VIRGINIA_TRANSFORMATION_NOTES =
  "STUB: West Virginia fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class WestVirginiaImporter implements Importer {
  name = WEST_VIRGINIA_DATASET_ID;
  description = "West Virginia State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: WEST_VIRGINIA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: WEST_VIRGINIA_SOURCE_NAME,
      sourceUrl: WEST_VIRGINIA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: WEST_VIRGINIA_TRANSFORMATION_NOTES,
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
