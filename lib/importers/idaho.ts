/**
 * Idaho state budget importer — stub / scaffolding.
 *
 * Data source: Idaho Transparent Government
 *   (https://transparent.idaho.gov/)
 *
 * Limitations / research notes:
 *   Idaho's transparency portal (transparent.idaho.gov) uses a custom web interface without a documented REST API.
 *   Tried: (1) transparent.idaho.gov, (2) data.idaho.gov (no Socrata portal), (3) Socrata discovery, (4) Idaho Division of Financial Management, (5) Idaho State Controller.
 *   No machine-readable monthly API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer idaho --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const IDAHO_DATASET_ID = "idaho";
const IDAHO_SOURCE_NAME = "Idaho Transparent Government";
const IDAHO_SOURCE_URL = "https://transparent.idaho.gov/";
const IDAHO_TRANSFORMATION_NOTES =
  "STUB: Idaho fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class IdahoImporter implements Importer {
  name = IDAHO_DATASET_ID;
  description = "Idaho State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: IDAHO_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: IDAHO_SOURCE_NAME,
      sourceUrl: IDAHO_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: IDAHO_TRANSFORMATION_NOTES,
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
