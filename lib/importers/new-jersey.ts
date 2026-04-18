/**
 * New Jersey state budget importer — stub / scaffolding.
 *
 * Data source: New Jersey YourMoney / Open Data
 *   (https://data.nj.gov/)
 *
 * Limitations / research notes:
 *   New Jersey has Socrata datasets for both expenditure (apet-rp2i, YourMoney Agency Expenditures, FY2026 available) and revenue (k9iw-i8yt, YourMoney Agency Revenue).
 *   However, expenditure data is annual aggregates (not monthly), and revenue has monthly columns but March 2026 data returned zeros suggesting it is not yet populated for current months.
 *   Tried: (1) data.nj.gov expenditure dataset, (2) data.nj.gov revenue dataset, (3) Socrata aggregation queries, (4) NJ Treasury transparency, (5) Various fiscal_year filters.
 *   Data exists but monthly granularity is incomplete.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer new-jersey --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const NEW_JERSEY_DATASET_ID = "new-jersey";
const NEW_JERSEY_SOURCE_NAME = "New Jersey YourMoney / Open Data";
const NEW_JERSEY_SOURCE_URL = "https://data.nj.gov/";
const NEW_JERSEY_TRANSFORMATION_NOTES =
  "STUB: New Jersey fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class NewJerseyImporter implements Importer {
  name = NEW_JERSEY_DATASET_ID;
  description = "New Jersey State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: NEW_JERSEY_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: NEW_JERSEY_SOURCE_NAME,
      sourceUrl: NEW_JERSEY_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: NEW_JERSEY_TRANSFORMATION_NOTES,
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
