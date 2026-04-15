/**
 * Washington state budget importer — stub / scaffolding.
 *
 * Data source: Washington State Fiscal Transparency (https://fiscal.wa.gov/)
 * Target period: March 2026 (end-of-month date 2026-03-31)
 *
 * TODO: Implement actual data ingestion from WA Fiscal Transparency or AFRS.
 *   - Washington's Agency Financial Reporting System (AFRS) provides monthly
 *     expenditure data; the Department of Revenue provides revenue by source.
 *   - Portal: https://fiscal.wa.gov/ and https://data.wa.gov/
 *   - Planned transformation: aggregate monthly expenditures by agency and
 *     revenue by tax/fund type into BudgetItem[].
 *   - Once implemented, run: npx tsx scripts/sync-budget.ts --importer washington --date 2026-03-31
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const WASHINGTON_DATASET_ID = "washington";
const WASHINGTON_SOURCE_NAME = "Washington State Fiscal Transparency";
const WASHINGTON_SOURCE_URL = "https://fiscal.wa.gov/";
const WASHINGTON_TRANSFORMATION_NOTES =
  "STUB: Washington state fiscal data ingestion not yet implemented. " +
  "Target: March 2026 monthly snapshot (2026-03-31). " +
  "Planned transformation: normalize AFRS agency expenditures and DOR revenue by source. " +
  "TODO: replace placeholder CSV with real Washington fiscal data.";

/** End-of-month date targeted for March 2026 data. */
export const WASHINGTON_MARCH_2026_DATE = "2026-03-31";

export class WashingtonImporter implements Importer {
  name = WASHINGTON_DATASET_ID;
  description = "Washington State Budget — March 2026 (stub, data not yet implemented)";

  private date: string;

  constructor(config?: ImporterConfig) {
    this.date = config?.date || WASHINGTON_MARCH_2026_DATE;
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
      datasetId: WASHINGTON_DATASET_ID,
      snapshotKey,
      sourceName: WASHINGTON_SOURCE_NAME,
      sourceUrl: WASHINGTON_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: WASHINGTON_TRANSFORMATION_NOTES,
    };
  }

  /** TODO: Fetch real data from Washington fiscal transparency portal. Currently returns an empty payload. */
  async fetch(): Promise<unknown> {
    // TODO: implement HTTP fetch from Washington AFRS or data.wa.gov
    return {};
  }

  /** TODO: Transform Washington AFRS rows into BudgetItem[]. Currently returns empty array. */
  transform(_data: unknown): BudgetItem[] {
    // TODO: parse Washington agency/revenue data and return normalized BudgetItem[]
    return [];
  }
}
