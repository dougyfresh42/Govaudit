/**
 * Montana state budget importer — stub / scaffolding.
 *
 * Data source: Montana Transparency
 *   (https://montana.gov/transparency/)
 *
 * Limitations / research notes:
 *   Montana does not have a Socrata open data portal for fiscal data.
 *   Tried: (1) data.mt.gov (does not exist), (2) Socrata discovery, (3) montana.gov/transparency, (4) Montana OBPP (budget.mt.gov), (5) Montana Department of Revenue.
 *   No machine-readable monthly API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer montana --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const MONTANA_DATASET_ID = "montana";
const MONTANA_SOURCE_NAME = "Montana Transparency";
const MONTANA_SOURCE_URL = "https://montana.gov/transparency/";
const MONTANA_TRANSFORMATION_NOTES =
  "STUB: Montana fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class MontanaImporter implements Importer {
  name = MONTANA_DATASET_ID;
  description = "Montana State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: MONTANA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: MONTANA_SOURCE_NAME,
      sourceUrl: MONTANA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: MONTANA_TRANSFORMATION_NOTES,
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
