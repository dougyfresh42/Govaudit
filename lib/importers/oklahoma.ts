/**
 * Oklahoma state budget importer — stub / scaffolding.
 *
 * Data source: Oklahoma Office of Management and Enterprise Services
 *   (https://oklahoma.gov/omes/services/budget.html)
 *
 * Limitations / research notes:
 *   Oklahoma OMES provides budget oversight but no open data portal was found.
 *   Tried: (1) data.ok.gov (no fiscal datasets), (2) Socrata discovery, (3) oklahoma.gov/omes, (4) Oklahoma State Treasurer transparency, (5) Oklahoma Tax Commission.
 *   No monthly Socrata API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer oklahoma --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const OKLAHOMA_DATASET_ID = "oklahoma";
const OKLAHOMA_SOURCE_NAME = "Oklahoma Office of Management and Enterprise Services";
const OKLAHOMA_SOURCE_URL = "https://oklahoma.gov/omes/services/budget.html";
const OKLAHOMA_TRANSFORMATION_NOTES =
  "STUB: Oklahoma fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class OklahomaImporter implements Importer {
  name = OKLAHOMA_DATASET_ID;
  description = "Oklahoma State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: OKLAHOMA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: OKLAHOMA_SOURCE_NAME,
      sourceUrl: OKLAHOMA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: OKLAHOMA_TRANSFORMATION_NOTES,
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
