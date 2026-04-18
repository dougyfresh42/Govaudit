/**
 * South Dakota state budget importer — stub / scaffolding.
 *
 * Data source: South Dakota Open Government
 *   (https://open.sd.gov/)
 *
 * Limitations / research notes:
 *   South Dakota Open Government portal provides some data but no Socrata-based fiscal datasets.
 *   Tried: (1) open.sd.gov, (2) Socrata discovery, (3) SD Bureau of Finance and Management, (4) SD Department of Revenue, (5) bfm.sd.gov.
 *   No machine-readable monthly fiscal API found.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer south-dakota --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const SOUTH_DAKOTA_DATASET_ID = "south-dakota";
const SOUTH_DAKOTA_SOURCE_NAME = "South Dakota Open Government";
const SOUTH_DAKOTA_SOURCE_URL = "https://open.sd.gov/";
const SOUTH_DAKOTA_TRANSFORMATION_NOTES =
  "STUB: South Dakota fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class SouthDakotaImporter implements Importer {
  name = SOUTH_DAKOTA_DATASET_ID;
  description = "South Dakota State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: SOUTH_DAKOTA_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: SOUTH_DAKOTA_SOURCE_NAME,
      sourceUrl: SOUTH_DAKOTA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: SOUTH_DAKOTA_TRANSFORMATION_NOTES,
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
