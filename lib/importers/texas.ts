/**
 * Texas state budget importer — stub / scaffolding.
 *
 * Data source: Texas Open Data / Comptroller of Public Accounts
 *   (https://data.texas.gov/)
 *
 * Limitations / research notes:
 *   Texas Socrata portal (data.texas.gov) is accessible.
 *   Found expenditure by county datasets (f2iw-dtqt for 2018, 2zpi-yjjs for 2024) but these are annual county-level aggregates, not monthly state-level data.
 *   Revenue data via comptroller.texas.gov is accessible but Socrata datasets found are limited to HOT/vehicle data.
 *   Tried: (1) data.texas.gov expenditure (annual only), (2) Socrata discovery for monthly, (3) comptroller.texas.gov, (4) Texas Transparency portal, (5) data.texas.gov revenue search.
 *   Annual data exists but no monthly granularity.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer texas --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const TEXAS_DATASET_ID = "texas";
const TEXAS_SOURCE_NAME = "Texas Open Data / Comptroller of Public Accounts";
const TEXAS_SOURCE_URL = "https://data.texas.gov/";
const TEXAS_TRANSFORMATION_NOTES =
  "STUB: Texas fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class TexasImporter implements Importer {
  name = TEXAS_DATASET_ID;
  description = "Texas State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: TEXAS_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: TEXAS_SOURCE_NAME,
      sourceUrl: TEXAS_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: TEXAS_TRANSFORMATION_NOTES,
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
