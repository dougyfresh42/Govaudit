/**
 * Maine state budget importer — stub / scaffolding.
 *
 * Data source: Maine Bureau of the Budget
 *   (https://www.maine.gov/budget/)
 *
 * Limitations / research notes:
 *   Maine does not have a Socrata open data portal for fiscal data.
 *   Budget documents are published as PDFs.
 *   Tried: (1) data.maine.gov (no fiscal datasets), (2) Socrata discovery, (3) maine.gov/budget, (4) Maine Office of the State Controller, (5) Maine Revenue Services.
 *   All fiscal data is PDF-based.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer maine --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const MAINE_DATASET_ID = "maine";
const MAINE_SOURCE_NAME = "Maine Bureau of the Budget";
const MAINE_SOURCE_URL = "https://www.maine.gov/budget/";
const MAINE_TRANSFORMATION_NOTES =
  "STUB: Maine fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class MaineImporter implements Importer {
  name = MAINE_DATASET_ID;
  description = "Maine State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: MAINE_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: MAINE_SOURCE_NAME,
      sourceUrl: MAINE_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: MAINE_TRANSFORMATION_NOTES,
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
