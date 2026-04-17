/**
 * Maryland state budget importer — stub / scaffolding.
 *
 * Data source: Maryland Open Data
 *   (https://data.maryland.gov/)
 *
 * Limitations / research notes:
 *   Maryland Socrata portal (data.maryland.gov) returned 404 for views API endpoint.
 *   Tried: (1) data.maryland.gov (404 on API), (2) Socrata discovery for maryland, (3) dbm.maryland.gov (Budget and Management), (4) spending.dbm.maryland.gov, (5) marylandtaxes.gov.
 *   Portal may be undergoing maintenance or restructured.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer maryland --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const MARYLAND_DATASET_ID = "maryland";
const MARYLAND_SOURCE_NAME = "Maryland Open Data";
const MARYLAND_SOURCE_URL = "https://data.maryland.gov/";
const MARYLAND_TRANSFORMATION_NOTES =
  "STUB: Maryland fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class MarylandImporter implements Importer {
  name = MARYLAND_DATASET_ID;
  description = "Maryland State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: MARYLAND_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: MARYLAND_SOURCE_NAME,
      sourceUrl: MARYLAND_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: MARYLAND_TRANSFORMATION_NOTES,
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
