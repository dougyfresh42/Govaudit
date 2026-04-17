/**
 * Delaware state budget importer — stub / scaffolding.
 *
 * Data source: Delaware Open Data / First State Financials
 *   (https://data.delaware.gov/)
 *
 * Limitations / research notes:
 *   Delaware has expenditure data on Socrata (data.delaware.gov, dataset 7bip-nb4g - Checkbook Expenditure Details with fiscal_year, fiscal_period, department, amount).
 *   FY2026 data confirmed.
 *   However, no monthly revenue/tax collection dataset was found on the portal.
 *   Tried: (1) data.delaware.gov checkbook (expenditure found), (2) Socrata discovery for revenue, (3) finance.delaware.gov, (4) revenue.delaware.gov, (5) Delaware Division of Accounting.
 *   Expenditure available but revenue endpoint missing.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer delaware --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const DELAWARE_DATASET_ID = "delaware";
const DELAWARE_SOURCE_NAME = "Delaware Open Data / First State Financials";
const DELAWARE_SOURCE_URL = "https://data.delaware.gov/";
const DELAWARE_TRANSFORMATION_NOTES =
  "STUB: Delaware fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class DelawareImporter implements Importer {
  name = DELAWARE_DATASET_ID;
  description = "Delaware State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: DELAWARE_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: DELAWARE_SOURCE_NAME,
      sourceUrl: DELAWARE_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: DELAWARE_TRANSFORMATION_NOTES,
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
