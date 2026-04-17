/**
 * Pennsylvania state budget importer — stub / scaffolding.
 *
 * Data source: Pennsylvania Open Data
 *   (https://data.pa.gov/)
 *
 * Limitations / research notes:
 *   Pennsylvania Socrata portal (data.pa.gov) is accessible but fiscal datasets found are limited to COVID expenditures and municipal data.
 *   No general state budget dataset with monthly granularity found.
 *   Tried: (1) data.pa.gov search for budget, (2) Socrata discovery, (3) patreasury.gov transparency, (4) PA Governor's Budget Office, (5) PA Department of Revenue.
 *   COVID data only; general fiscal API missing.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer pennsylvania --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const PENNSYLVANIA_DATASET_ID = "pennsylvania";
const PENNSYLVANIA_SOURCE_NAME = "Pennsylvania Open Data";
const PENNSYLVANIA_SOURCE_URL = "https://data.pa.gov/";
const PENNSYLVANIA_TRANSFORMATION_NOTES =
  "STUB: Pennsylvania fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class PennsylvaniaImporter implements Importer {
  name = PENNSYLVANIA_DATASET_ID;
  description = "Pennsylvania State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: PENNSYLVANIA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: PENNSYLVANIA_SOURCE_NAME,
      sourceUrl: PENNSYLVANIA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: PENNSYLVANIA_TRANSFORMATION_NOTES,
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
