/**
 * California state budget importer — stub / scaffolding.
 *
 * Data source: California State Controller's Office
 *   (https://bythenumbers.sco.ca.gov/)
 *
 * Limitations / research notes:
 *   California's By the Numbers (bythenumbers.sco.ca.gov) provides financial data but uses CKAN (data.ca.gov) rather than Socrata for open data.
 *   The fiscal transparency portal uses custom visualizations without a documented public API for monthly granularity.
 *   Tried: (1) bythenumbers.sco.ca.gov, (2) data.ca.gov CKAN API, (3) Socrata discovery for CA, (4) ebudget.ca.gov, (5) fiscal.ca.gov.
 *   State Controller publishes monthly cash reports as PDFs.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer california --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const CALIFORNIA_DATASET_ID = "california";
const CALIFORNIA_SOURCE_NAME = "California State Controller's Office";
const CALIFORNIA_SOURCE_URL = "https://bythenumbers.sco.ca.gov/";
const CALIFORNIA_TRANSFORMATION_NOTES =
  "STUB: California fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class CaliforniaImporter implements Importer {
  name = CALIFORNIA_DATASET_ID;
  description = "California State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: CALIFORNIA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: CALIFORNIA_SOURCE_NAME,
      sourceUrl: CALIFORNIA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: CALIFORNIA_TRANSFORMATION_NOTES,
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
