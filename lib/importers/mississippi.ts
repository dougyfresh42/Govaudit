/**
 * Mississippi state budget importer — stub / scaffolding.
 *
 * Data source: Mississippi Department of Finance and Administration
 *   (https://www.ms.gov/dfa/)
 *
 * Limitations / research notes:
 *   Mississippi does not have a public Socrata portal.
 *   DFA publishes reports.
 *   Tried: (1) data.mississippi.gov (does not exist), (2) Socrata discovery, (3) ms.gov/dfa transparency, (4) Mississippi Legislative Budget Office, (5) dor.ms.gov (Revenue).
 *   No machine-readable monthly API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer mississippi --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const MISSISSIPPI_DATASET_ID = "mississippi";
const MISSISSIPPI_SOURCE_NAME = "Mississippi Department of Finance and Administration";
const MISSISSIPPI_SOURCE_URL = "https://www.ms.gov/dfa/";
const MISSISSIPPI_TRANSFORMATION_NOTES =
  "STUB: Mississippi fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class MississippiImporter implements Importer {
  name = MISSISSIPPI_DATASET_ID;
  description = "Mississippi State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: MISSISSIPPI_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: MISSISSIPPI_SOURCE_NAME,
      sourceUrl: MISSISSIPPI_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: MISSISSIPPI_TRANSFORMATION_NOTES,
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
