/**
 * South Carolina state budget importer — stub / scaffolding.
 *
 * Data source: South Carolina Comptroller General
 *   (https://cg.sc.gov/fiscal-transparency)
 *
 * Limitations / research notes:
 *   South Carolina Comptroller General publishes monthly financial reports as PDFs.
 *   Tried: (1) data.sc.gov (no Socrata portal), (2) Socrata discovery, (3) cg.sc.gov fiscal transparency, (4) SC Revenue and Fiscal Affairs, (5) dor.sc.gov.
 *   Monthly reports exist but only as PDFs, no API.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer south-carolina --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const SOUTH_CAROLINA_DATASET_ID = "south-carolina";
const SOUTH_CAROLINA_SOURCE_NAME = "South Carolina Comptroller General";
const SOUTH_CAROLINA_SOURCE_URL = "https://cg.sc.gov/fiscal-transparency";
const SOUTH_CAROLINA_TRANSFORMATION_NOTES =
  "STUB: South Carolina fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class SouthCarolinaImporter implements Importer {
  name = SOUTH_CAROLINA_DATASET_ID;
  description = "South Carolina State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: SOUTH_CAROLINA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: SOUTH_CAROLINA_SOURCE_NAME,
      sourceUrl: SOUTH_CAROLINA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: SOUTH_CAROLINA_TRANSFORMATION_NOTES,
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
