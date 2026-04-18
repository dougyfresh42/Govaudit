/**
 * Hawaii state budget importer — stub / scaffolding.
 *
 * Data source: Hawaii Open Data
 *   (https://data.hawaii.gov/)
 *
 * Limitations / research notes:
 *   Hawaii's Socrata portal (data.hawaii.gov) returned 404 for API views.
 *   Tried: (1) data.hawaii.gov direct, (2) Socrata discovery for hawaii domain, (3) budget.hawaii.gov, (4) Hawaii DAGS financial transparency, (5) ets.hawaii.gov.
 *   No monthly fiscal datasets found; portal may have been restructured or deprecated.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer hawaii --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const HAWAII_DATASET_ID = "hawaii";
const HAWAII_SOURCE_NAME = "Hawaii Open Data";
const HAWAII_SOURCE_URL = "https://data.hawaii.gov/";
const HAWAII_TRANSFORMATION_NOTES =
  "STUB: Hawaii fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class HawaiiImporter implements Importer {
  name = HAWAII_DATASET_ID;
  description = "Hawaii State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: HAWAII_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: HAWAII_SOURCE_NAME,
      sourceUrl: HAWAII_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: HAWAII_TRANSFORMATION_NOTES,
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
