/**
 * Wisconsin state budget importer — stub / scaffolding.
 *
 * Data source: Wisconsin OpenBook
 *   (https://openbook.wi.gov/)
 *
 * Limitations / research notes:
 *   Wisconsin OpenBook (openbook.wi.gov) provides financial transparency but uses a custom portal.
 *   Tried: (1) data.wi.gov (no fiscal datasets), (2) Socrata discovery, (3) openbook.wi.gov, (4) Wisconsin Department of Administration, (5) revenue.wi.gov.
 *   Custom portal without documented REST API.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer wisconsin --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const WISCONSIN_DATASET_ID = "wisconsin";
const WISCONSIN_SOURCE_NAME = "Wisconsin OpenBook";
const WISCONSIN_SOURCE_URL = "https://openbook.wi.gov/";
const WISCONSIN_TRANSFORMATION_NOTES =
  "STUB: Wisconsin fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class WisconsinImporter implements Importer {
  name = WISCONSIN_DATASET_ID;
  description = "Wisconsin State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: WISCONSIN_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: WISCONSIN_SOURCE_NAME,
      sourceUrl: WISCONSIN_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: WISCONSIN_TRANSFORMATION_NOTES,
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
