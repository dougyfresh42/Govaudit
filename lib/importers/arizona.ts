/**
 * Arizona state budget importer — stub / scaffolding.
 *
 * Data source: Arizona OpenBooks
 *   (https://openbooks.az.gov/)
 *
 * Limitations / research notes:
 *   Arizona OpenBooks (openbooks.az.gov) provides transparency data but uses a custom portal without a public REST API.
 *   Tried: (1) openbooks.az.gov, (2) data.az.gov (does not exist as Socrata), (3) Socrata discovery, (4) AZ Department of Administration, (5) azgovernor.gov budget pages.
 *   No monthly granularity API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer arizona --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const ARIZONA_DATASET_ID = "arizona";
const ARIZONA_SOURCE_NAME = "Arizona OpenBooks";
const ARIZONA_SOURCE_URL = "https://openbooks.az.gov/";
const ARIZONA_TRANSFORMATION_NOTES =
  "STUB: Arizona fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class ArizonaImporter implements Importer {
  name = ARIZONA_DATASET_ID;
  description = "Arizona State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: ARIZONA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: ARIZONA_SOURCE_NAME,
      sourceUrl: ARIZONA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: ARIZONA_TRANSFORMATION_NOTES,
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
