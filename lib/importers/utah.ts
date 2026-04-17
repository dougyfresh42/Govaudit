/**
 * Utah state budget importer — stub / scaffolding.
 *
 * Data source: Utah Open Data
 *   (https://opendata.utah.gov/)
 *
 * Limitations / research notes:
 *   Utah Open Data (opendata.utah.gov) has an expenditure transparency dataset (dqdf-hweu) but data only goes up to FY2018 — last updated years ago.
 *   Tried: (1) opendata.utah.gov expenditure dataset (2018 max), (2) Socrata discovery, (3) utah.gov/finance transparency, (4) Utah Division of Finance, (5) tax.utah.gov.
 *   Dataset is stale; no current monthly data available.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer utah --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const UTAH_DATASET_ID = "utah";
const UTAH_SOURCE_NAME = "Utah Open Data";
const UTAH_SOURCE_URL = "https://opendata.utah.gov/";
const UTAH_TRANSFORMATION_NOTES =
  "STUB: Utah fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class UtahImporter implements Importer {
  name = UTAH_DATASET_ID;
  description = "Utah State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: UTAH_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: UTAH_SOURCE_NAME,
      sourceUrl: UTAH_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: UTAH_TRANSFORMATION_NOTES,
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
