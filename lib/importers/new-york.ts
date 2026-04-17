/**
 * New York state budget importer — stub / scaffolding.
 *
 * Data source: New York Open Data / Department of Taxation and Finance
 *   (https://data.ny.gov/)
 *
 * Limitations / research notes:
 *   New York has excellent monthly revenue data on Socrata (data.ny.gov, dataset 2vni-8tmb - monthly tax collections by type, March 2026 data confirmed).
 *   However, no monthly state-level expenditure dataset was found — NY budget appropriations datasets are annual/biennial only.
 *   Tried: (1) data.ny.gov revenue dataset (found!), (2) data.ny.gov expenditure search (annual only), (3) openbudget.ny.gov, (4) Socrata discovery for spending, (5) NY OSC transparency.
 *   Revenue API works but expenditure monthly API missing.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer new-york --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const NEW_YORK_DATASET_ID = "new-york";
const NEW_YORK_SOURCE_NAME = "New York Open Data / Department of Taxation and Finance";
const NEW_YORK_SOURCE_URL = "https://data.ny.gov/";
const NEW_YORK_TRANSFORMATION_NOTES =
  "STUB: New York fiscal data ingestion not yet implemented. " +
  "Planned: monthly revenue by tax type and expenditure by agency/department. " +
  "See importer file header for research notes on data source availability.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

export class NewYorkImporter implements Importer {
  name = NEW_YORK_DATASET_ID;
  description = "New York State Budget — monthly revenue and expenditure (stub)";

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
      datasetId: NEW_YORK_DATASET_ID,
      dataStatus: "stub",
      snapshotKey,
      sourceName: NEW_YORK_SOURCE_NAME,
      sourceUrl: NEW_YORK_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: NEW_YORK_TRANSFORMATION_NOTES,
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
