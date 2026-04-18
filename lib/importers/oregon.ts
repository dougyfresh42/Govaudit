/**
 * Oregon state budget importer — stub / scaffolding.
 *
 * Data source: Oregon Open Data
 *   (https://data.oregon.gov/)
 *
 * Limitations / research notes:
 *   Oregon Socrata portal (data.oregon.gov) is accessible.
 *   Found Budgeted Revenue dataset (mwsa-rpk9) but it contains biennial budget totals by agency, not monthly actuals.
 *   Tried: (1) data.oregon.gov revenue dataset (biennial only), (2) Socrata discovery for expenditure (none found), (3) oregon.gov/transparency, (4) Oregon DAS Chief Financial Office, (5) oregon.gov/dor (Revenue).
 *   Budget data is biennial, not monthly.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer oregon --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const OREGON_DATASET_ID = "oregon";
const OREGON_SOURCE_NAME = "Oregon Open Data";
const OREGON_SOURCE_URL = "https://data.oregon.gov/";
const OREGON_TRANSFORMATION_NOTES =
  "STUB: Oregon fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class OregonImporter implements Importer {
  name = OREGON_DATASET_ID;
  description = "Oregon State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: OREGON_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: OREGON_SOURCE_NAME,
      sourceUrl: OREGON_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: OREGON_TRANSFORMATION_NOTES,
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
