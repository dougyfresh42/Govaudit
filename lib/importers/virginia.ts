/**
 * Virginia state budget importer — stub / scaffolding.
 *
 * Data source: Virginia Open Data
 *   (https://data.virginia.gov/)
 *
 * Limitations / research notes:
 *   Virginia Socrata portal (data.virginia.gov) returned 404 for views API.
 *   Tried: (1) data.virginia.gov (404), (2) Socrata discovery, (3) datapoint.apa.virginia.gov, (4) VA Department of Planning and Budget, (5) tax.virginia.gov.
 *   Portal issues prevented API discovery.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer virginia --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const VIRGINIA_DATASET_ID = "virginia";
const VIRGINIA_SOURCE_NAME = "Virginia Open Data";
const VIRGINIA_SOURCE_URL = "https://data.virginia.gov/";
const VIRGINIA_TRANSFORMATION_NOTES =
  "STUB: Virginia fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class VirginiaImporter implements Importer {
  name = VIRGINIA_DATASET_ID;
  description = "Virginia State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: VIRGINIA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: VIRGINIA_SOURCE_NAME,
      sourceUrl: VIRGINIA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: VIRGINIA_TRANSFORMATION_NOTES,
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
