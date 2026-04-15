/**
 * Massachusetts state budget importer — stub / scaffolding.
 *
 * Data source: CTHRU — Massachusetts Statewide Accounting System (https://cthru.data.mass.gov/)
 * Target period: March 2026 (end-of-month date 2026-03-31)
 *
 * TODO: Implement actual data ingestion from CTHRU.
 *   - CTHRU exposes expenditure and payroll data via an API; revenue data is
 *     available from the MA Department of Revenue (https://www.mass.gov/orgs/massachusetts-department-of-revenue).
 *   - API docs: https://cthru.data.mass.gov/api/v1/
 *   - Planned transformation: aggregate monthly expenditures by department and
 *     revenue by category into BudgetItem[].
 *   - Once implemented, run: npx tsx scripts/sync-budget.ts --importer massachusetts --date 2026-03-31
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const MASSACHUSETTS_DATASET_ID = "massachusetts";
const MASSACHUSETTS_SOURCE_NAME = "Massachusetts CTHRU";
const MASSACHUSETTS_SOURCE_URL = "https://cthru.data.mass.gov/";
const MASSACHUSETTS_TRANSFORMATION_NOTES =
  "STUB: Massachusetts CTHRU data ingestion not yet implemented. " +
  "Target: March 2026 monthly snapshot (2026-03-31). " +
  "Planned transformation: normalize CTHRU department expenditures and DOR revenue by category. " +
  "TODO: replace placeholder CSV with real CTHRU data.";

/** End-of-month date targeted for March 2026 data. */
export const MASSACHUSETTS_MARCH_2026_DATE = "2026-03-31";

export class MassachusettsImporter implements Importer {
  name = MASSACHUSETTS_DATASET_ID;
  description = "Massachusetts State Budget — March 2026 (stub, data not yet implemented)";

  private date: string;

  constructor(config?: ImporterConfig) {
    this.date = config?.date || MASSACHUSETTS_MARCH_2026_DATE;
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
      datasetId: MASSACHUSETTS_DATASET_ID,
      snapshotKey,
      sourceName: MASSACHUSETTS_SOURCE_NAME,
      sourceUrl: MASSACHUSETTS_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: MASSACHUSETTS_TRANSFORMATION_NOTES,
    };
  }

  /** TODO: Fetch real data from CTHRU. Currently returns an empty payload. */
  async fetch(): Promise<unknown> {
    // TODO: implement HTTP fetch from https://cthru.data.mass.gov/api/v1/
    return {};
  }

  /** TODO: Transform CTHRU rows into BudgetItem[]. Currently returns empty array. */
  transform(_data: unknown): BudgetItem[] {
    // TODO: parse Massachusetts department/revenue data and return normalized BudgetItem[]
    return [];
  }
}
