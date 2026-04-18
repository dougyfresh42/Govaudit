/**
 * Georgia state budget importer — stub / scaffolding.
 *
 * Data source: Open Georgia
 *   (https://open.georgia.gov/)
 *
 * Limitations / research notes:
 *   Open Georgia (open.georgia.gov) portal was not accessible from this environment.
 *   Tried: (1) open.georgia.gov (connection blocked), (2) data.georgia.gov (no Socrata portal), (3) Socrata discovery, (4) Georgia Office of Planning and Budget, (5) Georgia Department of Revenue.
 *   Portal accessibility issues prevented API discovery.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer georgia --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const GEORGIA_DATASET_ID = "georgia";
const GEORGIA_SOURCE_NAME = "Open Georgia";
const GEORGIA_SOURCE_URL = "https://open.georgia.gov/";
const GEORGIA_TRANSFORMATION_NOTES =
  "STUB: Georgia fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class GeorgiaImporter implements Importer {
  name = GEORGIA_DATASET_ID;
  description = "Georgia State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: GEORGIA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: GEORGIA_SOURCE_NAME,
      sourceUrl: GEORGIA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: GEORGIA_TRANSFORMATION_NOTES,
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
