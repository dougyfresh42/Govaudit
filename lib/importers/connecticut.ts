/**
 * Connecticut state budget importer.
 *
 * Data sources:
 *   - Revenue: CT Tax Revenue by Month (data.ct.gov) — Socrata dataset aagd-92m2.
 *     Wide-format dataset with one row per month and columns for each tax type
 *     (withholding, sales_and_use, corporation_business, estate_gift, etc.).
 *     Amounts in whole dollars.
 *   - Expenditure: CT Open Expenditures - Ledger Current (data.ct.gov) —
 *     Socrata dataset ajdm-rvz7. Transaction-level data with fiscal_year,
 *     fiscal_year_period, department, and amount fields.
 *
 * Connecticut fiscal year runs July 1 – June 30.
 * Calendar month mapping: July = period 1, Aug = 2, … June = 12.
 *
 * Limitations:
 *   - Revenue data uses wide-format columns; each tax type is a separate column.
 *   - Some revenue columns may have zero or negative values (e.g., refund adjustments).
 *   - Expenditure is aggregated by department from individual payment transactions.
 *   - The "deprecated" label on dataset jz5u-r6jf was replaced with ajdm-rvz7 (current).
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer connecticut --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const CONNECTICUT_DATASET_ID = "connecticut";
const CONNECTICUT_SOURCE_NAME = "Connecticut Open Data (data.ct.gov)";
const CONNECTICUT_SOURCE_URL = "https://data.ct.gov/";
const CONNECTICUT_TRANSFORMATION_NOTES =
  "Revenue sourced from CT Tax Revenue by Month (Socrata dataset aagd-92m2), " +
  "with each tax type as a separate column. Amounts in whole dollars. " +
  "Expenditure sourced from CT Open Expenditures - Ledger Current (dataset ajdm-rvz7), " +
  "aggregated by department for the reporting month. " +
  "Revenue columns with zero or negative values are excluded. " +
  "Intra-governmental transfers excluded from expenditure.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

/** Shape of a CT expenditure aggregation row. */
interface CtExpenditureRow {
  department: string;
  total: string;
}

/** Shape of a CT revenue row (wide format — one row per month). */
interface CtRevenueRow {
  month: string;
  calendar_year: string;
  fiscal_year: string;
  [key: string]: string;
}

/**
 * Revenue columns to extract from the wide-format CT dataset.
 * Keys are column names; values are display labels.
 */
const REVENUE_COLUMNS: Record<string, string> = {
  withholding: "Withholding Tax",
  income_tax_estimates_finals: "Income Tax Estimates & Finals",
  sales_and_use: "Sales and Use Tax",
  room_occupancy: "Room Occupancy Tax",
  corporation_business: "Corporation Business Tax",
  composite_income_tax: "Composite Income Tax",
  pass_through_entity: "Pass-Through Entity Tax",
  estate_gift: "Estate and Gift Tax",
  insurance_premiums_domestic: "Insurance Premiums (Domestic)",
  insurance_premiums_foreign: "Insurance Premiums (Foreign)",
  alcoholic_beverages: "Alcoholic Beverages Tax",
  cigarette_tax: "Cigarette Tax",
  tobacco_products: "Tobacco Products Tax",
  cannabis_tax: "Cannabis Tax",
  real_estate_conveyance: "Real Estate Conveyance Tax",
  petroleum_gross_earnings: "Petroleum Gross Earnings Tax",
  admissions_dues_and_tnc_fee: "Admissions, Dues & TNC Fee",
  controlling_interest_transfer: "Controlling Interest Transfer Tax",
  occupational_tax: "Occupational Tax",
};

export class ConnecticutImporter implements Importer {
  name = CONNECTICUT_DATASET_ID;
  description = "Connecticut State Budget — monthly revenue and expenditure by department";

  private date: string;
  private readonly revenueDataset = "aagd-92m2";
  private readonly expenditureDataset = "ajdm-rvz7";
  private readonly baseUrl = "https://data.ct.gov/resource";

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
      datasetId: CONNECTICUT_DATASET_ID,
      dataStatus: "pulled",
      snapshotKey,
      sourceName: CONNECTICUT_SOURCE_NAME,
      sourceUrl: CONNECTICUT_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: CONNECTICUT_TRANSFORMATION_NOTES,
    };
  }

  async fetch(): Promise<{ revenue: CtRevenueRow[]; expenditure: CtExpenditureRow[] }> {
    const [year, month] = this.date.split("-");
    const calMonth = parseInt(month, 10);
    // CT fiscal year: July=1 ... June=12
    const fiscalPeriod = calMonth >= 7 ? calMonth - 6 : calMonth + 6;
    const fiscalYear = calMonth >= 7 ? parseInt(year, 10) + 1 : parseInt(year, 10);

    // Revenue uses calendar month name and calendar year
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const calMonthName = monthNames[calMonth - 1];

    const [revenue, expenditure] = await Promise.all([
      this.fetchRevenue(calMonthName, year),
      this.fetchExpenditure(fiscalYear, fiscalPeriod),
    ]);
    return { revenue, expenditure };
  }

  private async fetchRevenue(
    monthName: string,
    calYear: string
  ): Promise<CtRevenueRow[]> {
    const url =
      `${this.baseUrl}/${this.revenueDataset}.json` +
      `?$where=month='${monthName}' AND calendar_year='${calYear}'` +
      `&$limit=5`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CT Revenue API error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as CtRevenueRow[];
  }

  private async fetchExpenditure(
    fiscalYear: number,
    fiscalPeriod: number
  ): Promise<CtExpenditureRow[]> {
    const url =
      `${this.baseUrl}/${this.expenditureDataset}.json` +
      `?$select=department,sum(amount) as total` +
      `&$where=fiscal_year='${fiscalYear}' AND fiscal_year_period='${fiscalPeriod}'` +
      `&$group=department&$limit=500&$order=total DESC`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CT Expenditure API error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as CtExpenditureRow[];
  }

  transform(data: { revenue: CtRevenueRow[]; expenditure: CtExpenditureRow[] }): BudgetItem[] {
    const items: BudgetItem[] = [];

    // Revenue — extract tax columns from wide-format row
    if (data.revenue.length > 0) {
      const row = data.revenue[0];
      for (const [column, label] of Object.entries(REVENUE_COLUMNS)) {
        const rawValue = row[column];
        if (rawValue === undefined || rawValue === null) continue;
        const amount = parseFloat(String(rawValue).replace(/[,$]/g, ""));
        if (!isNaN(amount) && amount > 0) {
          items.push({
            type: "income",
            category: label,
            amount: Math.round(amount),
            description: `Connecticut revenue — ${label}`,
          });
        }
      }
    }

    // Expenditure — aggregated by department
    for (const row of data.expenditure) {
      const department = row.department?.trim();
      if (!department) continue;
      const amount = parseFloat((row.total ?? "0").replace(/[,$]/g, ""));
      if (!isNaN(amount) && amount > 0) {
        items.push({
          type: "spending",
          category: department,
          amount: Math.round(amount),
          description: `Connecticut expenditure — ${department}`,
        });
      }
    }

    return items;
  }
}
