/**
 * Louisiana state budget importer — stub / scaffolding.
 *
 * Data source: Louisiana LaTrac / Division of Administration
 *   (https://wwwprd.doa.louisiana.gov/LaTrac/)
 *
 * Limitations / research notes:
 *   Louisiana LaTrac transparency portal uses a custom interface.
 *   data.la.gov Socrata portal was not accessible from this environment.
 *   Tried: (1) data.la.gov (connection blocked), (2) LaTrac portal, (3) Socrata discovery, (4) Louisiana Division of Administration, (5) revenue.louisiana.gov.
 *   Network accessibility prevented API discovery.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer louisiana --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const LOUISIANA_DATASET_ID = "louisiana";
const LOUISIANA_SOURCE_NAME = "Louisiana LaTrac / Division of Administration";
const LOUISIANA_SOURCE_URL = "https://wwwprd.doa.louisiana.gov/LaTrac/";
const LOUISIANA_TRANSFORMATION_NOTES =
  "STUB: Louisiana fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class LouisianaImporter implements Importer {
  name = LOUISIANA_DATASET_ID;
  description = "Louisiana State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: LOUISIANA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: LOUISIANA_SOURCE_NAME,
      sourceUrl: LOUISIANA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: LOUISIANA_TRANSFORMATION_NOTES,
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
