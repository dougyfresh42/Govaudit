/**
 * Kentucky state budget importer — stub / scaffolding.
 *
 * Data source: Kentucky Transparency / Open Doors
 *   (https://transparency.ky.gov/)
 *
 * Limitations / research notes:
 *   Kentucky Transparency (transparency.ky.gov) uses a custom portal.
 *   data.ky.gov Socrata portal was not accessible from this environment.
 *   Tried: (1) data.ky.gov (connection blocked), (2) transparency.ky.gov, (3) Socrata discovery, (4) Kentucky Office of State Budget Director, (5) revenue.ky.gov.
 *   Network and portal limitations prevented API discovery.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer kentucky --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const KENTUCKY_DATASET_ID = "kentucky";
const KENTUCKY_SOURCE_NAME = "Kentucky Transparency / Open Doors";
const KENTUCKY_SOURCE_URL = "https://transparency.ky.gov/";
const KENTUCKY_TRANSFORMATION_NOTES =
  "STUB: Kentucky fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class KentuckyImporter implements Importer {
  name = KENTUCKY_DATASET_ID;
  description = "Kentucky State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: KENTUCKY_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: KENTUCKY_SOURCE_NAME,
      sourceUrl: KENTUCKY_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: KENTUCKY_TRANSFORMATION_NOTES,
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
