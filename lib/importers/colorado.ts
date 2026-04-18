/**
 * Colorado state budget importer — stub / scaffolding.
 *
 * Data source: Colorado Information Marketplace
 *   (https://data.colorado.gov/)
 *
 * Limitations / research notes:
 *   Colorado's Socrata portal (data.colorado.gov) is accessible but fiscal datasets found are limited to CDOT revenues and marijuana tax.
 *   No general state revenue or expenditure dataset with monthly granularity found.
 *   Tried: (1) data.colorado.gov search for budget/expenditure, (2) Socrata discovery, (3) CDOT revenues dataset (2kvt-7ybu, transport only), (4) colorado.gov/ospb budget office, (5) colorado.gov/pacific/treasury.
 *   CDOT dataset exists but only covers transportation.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer colorado --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const COLORADO_DATASET_ID = "colorado";
const COLORADO_SOURCE_NAME = "Colorado Information Marketplace";
const COLORADO_SOURCE_URL = "https://data.colorado.gov/";
const COLORADO_TRANSFORMATION_NOTES =
  "STUB: Colorado fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class ColoradoImporter implements Importer {
  name = COLORADO_DATASET_ID;
  description = "Colorado State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: COLORADO_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: COLORADO_SOURCE_NAME,
      sourceUrl: COLORADO_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: COLORADO_TRANSFORMATION_NOTES,
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
