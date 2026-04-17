/**
 * Missouri state budget importer — stub / scaffolding.
 *
 * Data source: Missouri Open Data
 *   (https://data.mo.gov/)
 *
 * Limitations / research notes:
 *   Missouri Socrata portal (data.mo.gov) is accessible but searches returned no current state budget datasets with monthly granularity.
 *   Found older (2000-2015) expenditure datasets only.
 *   Tried: (1) data.mo.gov search for budget, (2) Socrata discovery, (3) mapyourtaxes.mo.gov, (4) Missouri Office of Administration, (5) dor.mo.gov (Revenue).
 *   Historical data only, no current monthly API.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer missouri --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const MISSOURI_DATASET_ID = "missouri";
const MISSOURI_SOURCE_NAME = "Missouri Open Data";
const MISSOURI_SOURCE_URL = "https://data.mo.gov/";
const MISSOURI_TRANSFORMATION_NOTES =
  "STUB: Missouri fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class MissouriImporter implements Importer {
  name = MISSOURI_DATASET_ID;
  description = "Missouri State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: MISSOURI_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: MISSOURI_SOURCE_NAME,
      sourceUrl: MISSOURI_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: MISSOURI_TRANSFORMATION_NOTES,
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
