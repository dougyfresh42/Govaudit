/**
 * Alabama state budget importer — stub / scaffolding.
 *
 * Data source: Alabama Open Data / Department of Finance
 *   (https://open.alabama.gov/)
 *
 * Limitations / research notes:
 *   Alabama's open data portal (open.alabama.gov) provides some datasets but no Socrata-based monthly revenue or expenditure API was found.
 *   The Department of Finance publishes annual reports but no machine-readable monthly data endpoint is available.
 *   Tried: (1) open.alabama.gov API search, (2) Socrata discovery for data.alabama.gov, (3) comptroller.alabama.gov, (4) budget.alabama.gov, (5) data.alabama.gov direct.
 *   None returned monthly fiscal datasets.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer alabama --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const ALABAMA_DATASET_ID = "alabama";
const ALABAMA_SOURCE_NAME = "Alabama Open Data / Department of Finance";
const ALABAMA_SOURCE_URL = "https://open.alabama.gov/";
const ALABAMA_TRANSFORMATION_NOTES =
  "STUB: Alabama fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class AlabamaImporter implements Importer {
  name = ALABAMA_DATASET_ID;
  description = "Alabama State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: ALABAMA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: ALABAMA_SOURCE_NAME,
      sourceUrl: ALABAMA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: ALABAMA_TRANSFORMATION_NOTES,
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
