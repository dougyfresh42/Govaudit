/**
 * Arkansas state budget importer — stub / scaffolding.
 *
 * Data source: Arkansas Department of Finance and Administration
 *   (https://www.ark.org/dfa/transparency/)
 *
 * Limitations / research notes:
 *   Arkansas DFA publishes monthly revenue reports as PDFs but no API endpoint found.
 *   Tried: (1) ark.org/dfa/transparency, (2) data.arkansas.gov (no fiscal datasets on Socrata), (3) Socrata discovery, (4) transparency.arkansas.gov, (5) Arkansas Legislative Audit.
 *   PDF-only monthly reports.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer arkansas --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const ARKANSAS_DATASET_ID = "arkansas";
const ARKANSAS_SOURCE_NAME = "Arkansas Department of Finance and Administration";
const ARKANSAS_SOURCE_URL = "https://www.ark.org/dfa/transparency/";
const ARKANSAS_TRANSFORMATION_NOTES =
  "STUB: Arkansas fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class ArkansasImporter implements Importer {
  name = ARKANSAS_DATASET_ID;
  description = "Arkansas State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: ARKANSAS_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: ARKANSAS_SOURCE_NAME,
      sourceUrl: ARKANSAS_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: ARKANSAS_TRANSFORMATION_NOTES,
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
