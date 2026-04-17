/**
 * New Mexico state budget importer — stub / scaffolding.
 *
 * Data source: New Mexico Sunshine Portal
 *   (https://sunshineportalnm.com/)
 *
 * Limitations / research notes:
 *   New Mexico Sunshine Portal provides financial transparency but uses a custom web interface.
 *   Tried: (1) data.nm.gov (does not exist), (2) Socrata discovery, (3) sunshineportalnm.com, (4) NM Department of Finance and Administration, (5) tax.newmexico.gov.
 *   No public REST API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer new-mexico --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const NEW_MEXICO_DATASET_ID = "new-mexico";
const NEW_MEXICO_SOURCE_NAME = "New Mexico Sunshine Portal";
const NEW_MEXICO_SOURCE_URL = "https://sunshineportalnm.com/";
const NEW_MEXICO_TRANSFORMATION_NOTES =
  "STUB: New Mexico fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class NewMexicoImporter implements Importer {
  name = NEW_MEXICO_DATASET_ID;
  description = "New Mexico State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: NEW_MEXICO_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: NEW_MEXICO_SOURCE_NAME,
      sourceUrl: NEW_MEXICO_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: NEW_MEXICO_TRANSFORMATION_NOTES,
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
