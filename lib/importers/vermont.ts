/**
 * Vermont state budget importer — stub / scaffolding.
 *
 * Data source: Vermont Open Data
 *   (https://data.vermont.gov/)
 *
 * Limitations / research notes:
 *   Vermont Socrata portal (data.vermont.gov) has budget data (ta3d-fnef, 2015 Budget Data) and ARPA expenditure tracking, but no current general revenue/expenditure dataset with monthly granularity.
 *   Tried: (1) data.vermont.gov budget datasets (2015 only), (2) Socrata discovery, (3) finance.vermont.gov, (4) Vermont Department of Taxes, (5) Vermont Joint Fiscal Office.
 *   Historical budget data only.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer vermont --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const VERMONT_DATASET_ID = "vermont";
const VERMONT_SOURCE_NAME = "Vermont Open Data";
const VERMONT_SOURCE_URL = "https://data.vermont.gov/";
const VERMONT_TRANSFORMATION_NOTES =
  "STUB: Vermont fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class VermontImporter implements Importer {
  name = VERMONT_DATASET_ID;
  description = "Vermont State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: VERMONT_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: VERMONT_SOURCE_NAME,
      sourceUrl: VERMONT_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: VERMONT_TRANSFORMATION_NOTES,
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
