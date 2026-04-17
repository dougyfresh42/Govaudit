/**
 * Illinois state budget importer — stub / scaffolding.
 *
 * Data source: Illinois Comptroller / Open Data
 *   (https://data.illinois.gov/)
 *
 * Limitations / research notes:
 *   Illinois Socrata portal (data.illinois.gov) is accessible but searches for budget/expenditure/revenue returned no relevant state-level fiscal datasets with monthly granularity.
 *   The Illinois Comptroller (illinoiscomptroller.gov) has a Ledger site but it uses a custom portal.
 *   Tried: (1) data.illinois.gov search, (2) Socrata discovery for illinois, (3) ledger.illinoiscomptroller.gov (custom UI), (4) Illinois GOMB, (5) tax.illinois.gov.
 *   Comptroller Ledger has data but no public API.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer illinois --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const ILLINOIS_DATASET_ID = "illinois";
const ILLINOIS_SOURCE_NAME = "Illinois Comptroller / Open Data";
const ILLINOIS_SOURCE_URL = "https://data.illinois.gov/";
const ILLINOIS_TRANSFORMATION_NOTES =
  "STUB: Illinois fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class IllinoisImporter implements Importer {
  name = ILLINOIS_DATASET_ID;
  description = "Illinois State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: ILLINOIS_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: ILLINOIS_SOURCE_NAME,
      sourceUrl: ILLINOIS_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: ILLINOIS_TRANSFORMATION_NOTES,
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
