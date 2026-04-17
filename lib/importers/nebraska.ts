/**
 * Nebraska state budget importer — stub / scaffolding.
 *
 * Data source: Nebraska Administrative Services
 *   (https://statewide.das.nebraska.gov/)
 *
 * Limitations / research notes:
 *   Nebraska does not have a Socrata portal.
 *   Tried: (1) data.nebraska.gov (does not exist), (2) Socrata discovery, (3) das.nebraska.gov transparency, (4) Nebraska Department of Revenue, (5) budget.ne.gov.
 *   No machine-readable monthly API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer nebraska --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const NEBRASKA_DATASET_ID = "nebraska";
const NEBRASKA_SOURCE_NAME = "Nebraska Administrative Services";
const NEBRASKA_SOURCE_URL = "https://statewide.das.nebraska.gov/";
const NEBRASKA_TRANSFORMATION_NOTES =
  "STUB: Nebraska fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class NebraskaImporter implements Importer {
  name = NEBRASKA_DATASET_ID;
  description = "Nebraska State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: NEBRASKA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: NEBRASKA_SOURCE_NAME,
      sourceUrl: NEBRASKA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: NEBRASKA_TRANSFORMATION_NOTES,
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
