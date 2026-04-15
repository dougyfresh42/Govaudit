/**
 * Florida state budget importer — stub / scaffolding.
 *
 * Data source: Transparency Florida (https://transparency.myflorida.com/)
 * Target period: March 2026 (end-of-month date 2026-03-31)
 *
 * NOTE: Florida has no state income tax. Revenue consists primarily of sales
 * tax, corporate income tax, documentary stamp taxes, and federal transfers.
 *
 * TODO: Implement actual data ingestion from Transparency Florida or FLAIR.
 *   - Florida's Financial Information System (FLAIR) powers Transparency Florida.
 *   - The Transparency Florida portal exposes expenditure detail by agency/category.
 *   - Revenue data: Florida Department of Revenue (https://floridarevenue.com/).
 *   - Planned transformation: aggregate monthly expenditures by department and
 *     revenue by source into BudgetItem[].
 *   - Once implemented, run: npx tsx scripts/sync-budget.ts --importer florida --date 2026-03-31
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const FLORIDA_DATASET_ID = "florida";
const FLORIDA_SOURCE_NAME = "Transparency Florida";
const FLORIDA_SOURCE_URL = "https://transparency.myflorida.com/";
const FLORIDA_TRANSFORMATION_NOTES =
  "STUB: Transparency Florida / FLAIR data ingestion not yet implemented. " +
  "Target: March 2026 monthly snapshot (2026-03-31). " +
  "Note: Florida has no state income tax; revenue categories differ from income-tax states. " +
  "Planned transformation: normalize FLAIR agency expenditures and DOR revenue by source. " +
  "TODO: replace placeholder CSV with real Transparency Florida data.";

/** End-of-month date targeted for March 2026 data. */
export const FLORIDA_MARCH_2026_DATE = "2026-03-31";

export class FloridaImporter implements Importer {
  name = FLORIDA_DATASET_ID;
  description = "Florida State Budget — March 2026 (stub, data not yet implemented)";

  private date: string;

  constructor(config?: ImporterConfig) {
    this.date = config?.date || FLORIDA_MARCH_2026_DATE;
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
      datasetId: FLORIDA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: FLORIDA_SOURCE_NAME,
      sourceUrl: FLORIDA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: FLORIDA_TRANSFORMATION_NOTES,
    };
  }

  /** TODO: Fetch real data from Transparency Florida. Currently returns an empty payload. */
  async fetch(): Promise<unknown> {
    // TODO: implement HTTP fetch from Transparency Florida / FLAIR or floridarevenue.com
    return {};
  }

  /** TODO: Transform Florida budget rows into BudgetItem[]. Currently returns empty array. */
  transform(_data: unknown): BudgetItem[] {
    // TODO: parse Florida agency/revenue data and return normalized BudgetItem[]
    return [];
  }
}
