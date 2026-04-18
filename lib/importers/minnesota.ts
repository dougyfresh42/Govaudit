/**
 * Minnesota state budget importer — stub / scaffolding.
 *
 * Data source: Minnesota Management and Budget
 *   (https://mn.gov/mmb/)
 *
 * Limitations / research notes:
 *   Minnesota Management and Budget (mn.gov/mmb) publishes fiscal data but does not use Socrata.
 *   Tried: (1) data.mn.gov (redirects to portal), (2) Socrata discovery for mn domain, (3) mn.gov/mmb transparency, (4) Minnesota Checkbook (mn.gov/mmbapps), (5) revenue.state.mn.us.
 *   Custom portal without documented REST API.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer minnesota --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const MINNESOTA_DATASET_ID = "minnesota";
const MINNESOTA_SOURCE_NAME = "Minnesota Management and Budget";
const MINNESOTA_SOURCE_URL = "https://mn.gov/mmb/";
const MINNESOTA_TRANSFORMATION_NOTES =
  "STUB: Minnesota fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class MinnesotaImporter implements Importer {
  name = MINNESOTA_DATASET_ID;
  description = "Minnesota State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: MINNESOTA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: MINNESOTA_SOURCE_NAME,
      sourceUrl: MINNESOTA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: MINNESOTA_TRANSFORMATION_NOTES,
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
