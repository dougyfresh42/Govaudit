/**
 * New Hampshire state budget importer — stub / scaffolding.
 *
 * Data source: Transparent New Hampshire
 *   (https://www.nh.gov/transparentnh/)
 *
 * Limitations / research notes:
 *   New Hampshire's Transparent NH portal uses a custom web interface.
 *   Tried: (1) data.nh.gov (does not exist), (2) Socrata discovery, (3) nh.gov/transparentnh, (4) NH Department of Revenue Administration, (5) NH Office of Legislative Budget Assistant.
 *   No Socrata or REST API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer new-hampshire --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const NEW_HAMPSHIRE_DATASET_ID = "new-hampshire";
const NEW_HAMPSHIRE_SOURCE_NAME = "Transparent New Hampshire";
const NEW_HAMPSHIRE_SOURCE_URL = "https://www.nh.gov/transparentnh/";
const NEW_HAMPSHIRE_TRANSFORMATION_NOTES =
  "STUB: New Hampshire fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class NewHampshireImporter implements Importer {
  name = NEW_HAMPSHIRE_DATASET_ID;
  description = "New Hampshire State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: NEW_HAMPSHIRE_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: NEW_HAMPSHIRE_SOURCE_NAME,
      sourceUrl: NEW_HAMPSHIRE_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: NEW_HAMPSHIRE_TRANSFORMATION_NOTES,
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
