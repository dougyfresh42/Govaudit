/**
 * Tennessee state budget importer — stub / scaffolding.
 *
 * Data source: Tennessee Open Data
 *   (https://data.tn.gov/)
 *
 * Limitations / research notes:
 *   Tennessee data portal (data.tn.gov) returned 404 for API views endpoint.
 *   Tried: (1) data.tn.gov (404), (2) Socrata discovery, (3) tn.gov/finance transparency, (4) Tennessee Comptroller, (5) tn.gov/revenue.
 *   Portal may be restructured or unavailable.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer tennessee --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const TENNESSEE_DATASET_ID = "tennessee";
const TENNESSEE_SOURCE_NAME = "Tennessee Open Data";
const TENNESSEE_SOURCE_URL = "https://data.tn.gov/";
const TENNESSEE_TRANSFORMATION_NOTES =
  "STUB: Tennessee fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class TennesseeImporter implements Importer {
  name = TENNESSEE_DATASET_ID;
  description = "Tennessee State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: TENNESSEE_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: TENNESSEE_SOURCE_NAME,
      sourceUrl: TENNESSEE_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: TENNESSEE_TRANSFORMATION_NOTES,
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
