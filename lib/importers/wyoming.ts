/**
 * Wyoming state budget importer — stub / scaffolding.
 *
 * Data source: Wyoming Department of Audit / Administration and Information
 *   (https://ai.wyo.gov/)
 *
 * Limitations / research notes:
 *   Wyoming does not have a Socrata open data portal.
 *   Tried: (1) data.wyo.gov (does not exist), (2) Socrata discovery, (3) ai.wyo.gov, (4) Wyoming Budget Department, (5) revenue.wyo.gov.
 *   Smallest state by population; budget data published in PDF reports only.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer wyoming --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const WYOMING_DATASET_ID = "wyoming";
const WYOMING_SOURCE_NAME = "Wyoming Department of Audit / Administration and Information";
const WYOMING_SOURCE_URL = "https://ai.wyo.gov/";
const WYOMING_TRANSFORMATION_NOTES =
  "STUB: Wyoming fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class WyomingImporter implements Importer {
  name = WYOMING_DATASET_ID;
  description = "Wyoming State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: WYOMING_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: WYOMING_SOURCE_NAME,
      sourceUrl: WYOMING_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: WYOMING_TRANSFORMATION_NOTES,
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
