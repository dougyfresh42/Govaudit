/**
 * Michigan state budget importer — stub / scaffolding.
 *
 * Data source: Michigan Open Data
 *   (https://data.michigan.gov/)
 *
 * Limitations / research notes:
 *   Michigan Socrata portal (data.michigan.gov) is accessible but searches returned no state-level monthly revenue or expenditure datasets.
 *   Tried: (1) data.michigan.gov search for budget/expenditure, (2) Socrata discovery, (3) michigan.gov/budget, (4) Michigan Department of Treasury, (5) michigan.gov/transparency.
 *   No monthly fiscal datasets found on Socrata.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer michigan --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const MICHIGAN_DATASET_ID = "michigan";
const MICHIGAN_SOURCE_NAME = "Michigan Open Data";
const MICHIGAN_SOURCE_URL = "https://data.michigan.gov/";
const MICHIGAN_TRANSFORMATION_NOTES =
  "STUB: Michigan fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class MichiganImporter implements Importer {
  name = MICHIGAN_DATASET_ID;
  description = "Michigan State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: MICHIGAN_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: MICHIGAN_SOURCE_NAME,
      sourceUrl: MICHIGAN_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: MICHIGAN_TRANSFORMATION_NOTES,
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
