/**
 * Indiana state budget importer — stub / scaffolding.
 *
 * Data source: Indiana Transparency Portal
 *   (https://www.in.gov/itp/)
 *
 * Limitations / research notes:
 *   Indiana Transparency Portal (in.gov/itp) provides fiscal data but data.in.gov Socrata portal was not accessible from this environment.
 *   Tried: (1) data.in.gov (connection blocked), (2) Socrata discovery, (3) in.gov/itp transparency portal, (4) in.gov/sba State Budget Agency, (5) in.gov/dor Department of Revenue.
 *   Network accessibility prevented API discovery.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer indiana --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const INDIANA_DATASET_ID = "indiana";
const INDIANA_SOURCE_NAME = "Indiana Transparency Portal";
const INDIANA_SOURCE_URL = "https://www.in.gov/itp/";
const INDIANA_TRANSFORMATION_NOTES =
  "STUB: Indiana fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class IndianaImporter implements Importer {
  name = INDIANA_DATASET_ID;
  description = "Indiana State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: INDIANA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: INDIANA_SOURCE_NAME,
      sourceUrl: INDIANA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: INDIANA_TRANSFORMATION_NOTES,
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
