/**
 * Kansas state budget importer — stub / scaffolding.
 *
 * Data source: Kansas KanView Transparency
 *   (https://kanview.ks.gov/)
 *
 * Limitations / research notes:
 *   Kansas KanView (kanview.ks.gov) provides financial transparency but uses a custom portal.
 *   Tried: (1) kanview.ks.gov, (2) data.kansas.gov (no fiscal datasets), (3) Socrata discovery, (4) Kansas Division of the Budget, (5) Kansas Department of Revenue.
 *   No public REST API for monthly data found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer kansas --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const KANSAS_DATASET_ID = "kansas";
const KANSAS_SOURCE_NAME = "Kansas KanView Transparency";
const KANSAS_SOURCE_URL = "https://kanview.ks.gov/";
const KANSAS_TRANSFORMATION_NOTES =
  "STUB: Kansas fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class KansasImporter implements Importer {
  name = KANSAS_DATASET_ID;
  description = "Kansas State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: KANSAS_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: KANSAS_SOURCE_NAME,
      sourceUrl: KANSAS_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: KANSAS_TRANSFORMATION_NOTES,
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
