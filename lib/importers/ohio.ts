/**
 * Ohio state budget importer — stub / scaffolding.
 *
 * Data source: Ohio Checkbook (https://ohiocheckbook.ohio.gov/)
 * Target period: March 2026 (end-of-month date 2026-03-31)
 *
 * TODO: Implement actual data ingestion from Ohio Checkbook.
 *   - Ohio Checkbook exposes expenditure data; a revenue dataset may require
 *     the Ohio Office of Budget and Management (https://obm.ohio.gov/).
 *   - Planned transformation: aggregate monthly expenditures by agency/department
 *     and revenue by fund type into BudgetItem[].
 *   - Once implemented, run: npx tsx scripts/sync-budget.ts --importer ohio --date 2026-03-31
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const OHIO_DATASET_ID = "ohio";
const OHIO_SOURCE_NAME = "Ohio Checkbook";
const OHIO_SOURCE_URL = "https://ohiocheckbook.ohio.gov/";
const OHIO_TRANSFORMATION_NOTES =
  "STUB: Ohio Checkbook data ingestion not yet implemented. " +
  "Target: March 2026 monthly snapshot (2026-03-31). " +
  "Planned transformation: normalize agency expenditures and revenue by fund category. " +
  "TODO: replace placeholder CSV with real Ohio Checkbook data.";

/** End-of-month date targeted for March 2026 data. */
export const OHIO_MARCH_2026_DATE = "2026-03-31";

export class OhioImporter implements Importer {
  name = OHIO_DATASET_ID;
  description = "Ohio State Budget — March 2026 (stub, data not yet implemented)";

  private date: string;

  constructor(config?: ImporterConfig) {
    this.date = config?.date || OHIO_MARCH_2026_DATE;
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
      datasetId: OHIO_DATASET_ID,
      snapshotKey,
      sourceName: OHIO_SOURCE_NAME,
      sourceUrl: OHIO_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: OHIO_TRANSFORMATION_NOTES,
    };
  }

  /** TODO: Fetch real data from Ohio Checkbook. Currently returns an empty payload. */
  async fetch(): Promise<unknown> {
    // TODO: implement HTTP fetch from Ohio Checkbook API or CSV download
    return {};
  }

  /** TODO: Transform Ohio Checkbook rows into BudgetItem[]. Currently returns empty array. */
  transform(_data: unknown): BudgetItem[] {
    // TODO: parse Ohio agency/revenue data and return normalized BudgetItem[]
    return [];
  }
}
