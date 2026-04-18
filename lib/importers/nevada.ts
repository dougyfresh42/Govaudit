/**
 * Nevada state budget importer — stub / scaffolding.
 *
 * Data source: Nevada Open Data / Controller's Office
 *   (https://opendata.nv.gov/)
 *
 * Limitations / research notes:
 *   Nevada has an open data portal but it focuses on non-fiscal data.
 *   Tried: (1) opendata.nv.gov, (2) Socrata discovery, (3) controller.nv.gov transparency, (4) Nevada Budget Office, (5) tax.nv.gov.
 *   No monthly budget/revenue Socrata API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer nevada --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const NEVADA_DATASET_ID = "nevada";
const NEVADA_SOURCE_NAME = "Nevada Open Data / Controller's Office";
const NEVADA_SOURCE_URL = "https://opendata.nv.gov/";
const NEVADA_TRANSFORMATION_NOTES =
  "STUB: Nevada fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class NevadaImporter implements Importer {
  name = NEVADA_DATASET_ID;
  description = "Nevada State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: NEVADA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: NEVADA_SOURCE_NAME,
      sourceUrl: NEVADA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: NEVADA_TRANSFORMATION_NOTES,
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
