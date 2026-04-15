/**
 * Connecticut state budget importer — stub / scaffolding.
 *
 * Data source: Open Budget CT (https://openbudget.ct.gov/) and data.ct.gov
 * Target period: March 2026 (end-of-month date 2026-03-31)
 *
 * TODO: Implement actual data ingestion from Open Budget CT or data.ct.gov.
 *   - Connecticut's Open Budget portal exposes allotment, expenditure, and
 *     revenue data. The Socrata-based data.ct.gov API is machine-readable.
 *   - data.ct.gov datasets: https://data.ct.gov/browse?category=Government
 *   - Planned transformation: aggregate monthly allotments/expenditures by agency
 *     and revenue by fund type into BudgetItem[].
 *   - Once implemented, run: npx tsx scripts/sync-budget.ts --importer connecticut --date 2026-03-31
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const CONNECTICUT_DATASET_ID = "connecticut";
const CONNECTICUT_SOURCE_NAME = "Open Budget CT";
const CONNECTICUT_SOURCE_URL = "https://openbudget.ct.gov/";
const CONNECTICUT_TRANSFORMATION_NOTES =
  "STUB: Connecticut Open Budget data ingestion not yet implemented. " +
  "Target: March 2026 monthly snapshot (2026-03-31). " +
  "Planned transformation: normalize agency allotments/expenditures and revenue by fund. " +
  "TODO: replace placeholder CSV with real Open Budget CT data.";

/** End-of-month date targeted for March 2026 data. */
export const CONNECTICUT_MARCH_2026_DATE = "2026-03-31";

export class ConnecticutImporter implements Importer {
  name = CONNECTICUT_DATASET_ID;
  description = "Connecticut State Budget — March 2026 (stub, data not yet implemented)";

  private date: string;

  constructor(config?: ImporterConfig) {
    this.date = config?.date || CONNECTICUT_MARCH_2026_DATE;
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
      datasetId: CONNECTICUT_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: CONNECTICUT_SOURCE_NAME,
      sourceUrl: CONNECTICUT_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: CONNECTICUT_TRANSFORMATION_NOTES,
    };
  }

  /** TODO: Fetch real data from Open Budget CT. Currently returns an empty payload. */
  async fetch(): Promise<unknown> {
    // TODO: implement HTTP fetch from data.ct.gov or openbudget.ct.gov
    return {};
  }

  /** TODO: Transform Connecticut budget rows into BudgetItem[]. Currently returns empty array. */
  transform(_data: unknown): BudgetItem[] {
    // TODO: parse Connecticut agency/revenue data and return normalized BudgetItem[]
    return [];
  }
}
