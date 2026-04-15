/**
 * Ohio state budget importer.
 *
 * Data sources:
 *   - Revenue: Ohio Office of Budget and Management (OBM) General Revenue Fund
 *     monthly collection report. Published at https://obm.ohio.gov/
 *   - Expenditure: Ohio Checkbook (https://ohiocheckbook.ohio.gov/),
 *     which surfaces OAKS (Ohio Administrative Knowledge System) data.
 *     Raw expenditure CSV is downloadable via the Ohio Open Data portal
 *     (https://data.ohio.gov/).
 *
 * Target period: March 2026 (end-of-month date 2026-03-31)
 * Ohio fiscal year runs July 1 – June 30; March is period 9 of FY2026.
 *
 * Data notes:
 *   - Figures reflect the Ohio General Revenue Fund (GRF) plus federal receipts
 *     that flow through the state treasury.
 *   - Revenue categories mirror OBM's Monthly Financial Report table headings.
 *   - Expenditure categories reflect agency-level roll-ups from the Checkbook.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer ohio --date 2026-03-31
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const OHIO_DATASET_ID = "ohio";
const OHIO_SOURCE_NAME = "Ohio Checkbook / Office of Budget and Management";
const OHIO_SOURCE_URL = "https://ohiocheckbook.ohio.gov/";
const OHIO_TRANSFORMATION_NOTES =
  "Revenue sourced from Ohio OBM General Revenue Fund monthly collection report. " +
  "Expenditure sourced from Ohio Checkbook (OAKS data) aggregated by agency. " +
  "Revenue categories follow OBM Monthly Financial Report table headings. " +
  "Expenditure rows are agency-level totals; intra-governmental transfers excluded. " +
  "Amounts in whole dollars; federal reimbursements included in relevant agency lines.";

/** End-of-month date targeted for March 2026 data. */
export const OHIO_MARCH_2026_DATE = "2026-03-31";

/** Shape of a row returned by the Ohio Checkbook expenditure download. */
interface OhioExpenditureRow {
  agency_name: string;
  total_expenditures: string;
  fiscal_year: string;
  fiscal_period: string;
}

/** Shape of a row returned by the OBM revenue collection report. */
interface OhioRevenueRow {
  revenue_source: string;
  monthly_amount: string;
  fiscal_year: string;
  fiscal_period: string;
}

export class OhioImporter implements Importer {
  name = OHIO_DATASET_ID;
  description = "Ohio State Budget — monthly revenue and expenditure by agency";

  private date: string;

  // Ohio Open Data (data.ohio.gov) Socrata API identifiers
  private readonly baseUrl = "https://data.ohio.gov/api/v1/datastore/query";
  private readonly expenditureDatasetId = "ohiocheckbook-expenditures";
  private readonly revenueDatasetId = "obm-general-revenue-fund";

  constructor(config?: ImporterConfig) {
    this.date = config?.date || OHIO_MARCH_2026_DATE;
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
      datasetId: OHIO_DATASET_ID,
      snapshotKey,
      sourceName: OHIO_SOURCE_NAME,
      sourceUrl: OHIO_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: OHIO_TRANSFORMATION_NOTES,
    };
  }

  async fetch(): Promise<{ revenue: OhioRevenueRow[]; expenditure: OhioExpenditureRow[] }> {
    const [year, month] = this.date.split("-");
    // Ohio fiscal year: July=1 ... June=12. Convert calendar month to fiscal period.
    const calMonth = parseInt(month, 10);
    // FY starts July (month 7); periods 1-12 map to July-June.
    const fiscalPeriod = calMonth >= 7 ? calMonth - 6 : calMonth + 6;
    const fiscalYear = calMonth >= 7 ? parseInt(year, 10) + 1 : parseInt(year, 10);

    const [revenue, expenditure] = await Promise.all([
      this.fetchRevenue(fiscalYear, fiscalPeriod),
      this.fetchExpenditure(fiscalYear, fiscalPeriod),
    ]);
    return { revenue, expenditure };
  }

  private async fetchRevenue(fiscalYear: number, fiscalPeriod: number): Promise<OhioRevenueRow[]> {
    const url =
      `${this.baseUrl}/${this.revenueDatasetId}` +
      `?fiscal_year=${fiscalYear}&fiscal_period=${fiscalPeriod}&limit=100`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ohio revenue API error: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return (json.results ?? json.data ?? []) as OhioRevenueRow[];
  }

  private async fetchExpenditure(fiscalYear: number, fiscalPeriod: number): Promise<OhioExpenditureRow[]> {
    const url =
      `${this.baseUrl}/${this.expenditureDatasetId}` +
      `?fiscal_year=${fiscalYear}&fiscal_period=${fiscalPeriod}&limit=5000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ohio Checkbook API error: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return (json.results ?? json.data ?? []) as OhioExpenditureRow[];
  }

  transform(data: { revenue: OhioRevenueRow[]; expenditure: OhioExpenditureRow[] }): BudgetItem[] {
    const items: BudgetItem[] = [];

    // Revenue
    for (const row of data.revenue) {
      const category = row.revenue_source?.trim();
      if (!category) continue;
      const amount = parseFloat((row.monthly_amount ?? "0").replace(/[,$]/g, ""));
      if (!isNaN(amount) && amount > 0) {
        items.push({
          type: "income",
          category,
          amount: Math.round(amount),
          description: `Ohio revenue — ${category}`,
        });
      }
    }

    // Expenditure — aggregate by agency
    const byAgency = new Map<string, number>();
    for (const row of data.expenditure) {
      const agency = row.agency_name?.trim();
      if (!agency) continue;
      const amount = parseFloat((row.total_expenditures ?? "0").replace(/[,$]/g, ""));
      if (!isNaN(amount)) {
        byAgency.set(agency, (byAgency.get(agency) ?? 0) + amount);
      }
    }
    for (const [agency, total] of byAgency) {
      if (total <= 0) continue;
      items.push({
        type: "spending",
        category: agency,
        amount: Math.round(total),
        description: `Ohio expenditure — ${agency}`,
      });
    }

    return items;
  }
}
