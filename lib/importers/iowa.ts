/**
 * Iowa state budget importer.
 *
 * Data sources:
 *   - Expenditure: Iowa Checkbook (mydata.iowa.gov) — Socrata dataset cyqb-8ina.
 *     Provides transaction-level state spending data with fiscal_year,
 *     fiscal_year_period, department, and amount fields.
 *   - Revenue: Iowa Tax Receipts and Refunds (mydata.iowa.gov) — Socrata dataset s98w-ib9t.
 *     Monthly tax receipt data with columns for individual income tax, sales tax,
 *     corporate income tax, and other categories. Amounts are in millions of dollars.
 *
 * Iowa fiscal year runs July 1 – June 30.
 * Calendar month mapping: July = period 1, Aug = 2, … June = 12.
 * The fiscal_month column format is "{period}-{MonthAbbrev}" e.g. "9-Mar".
 *
 * Limitations:
 *   - Revenue data is reported in millions of dollars (converted to whole dollars).
 *   - Revenue refund columns are subtracted from the corresponding receipt columns
 *     to give net collections; negative net values are excluded.
 *   - Expenditure data is aggregated by department from individual transactions.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer iowa --date YYYY-MM-DD
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const IOWA_DATASET_ID = "iowa";
const IOWA_SOURCE_NAME = "Iowa Open Data / Iowa Checkbook";
const IOWA_SOURCE_URL = "https://mydata.iowa.gov/";
const IOWA_TRANSFORMATION_NOTES =
  "Expenditure sourced from Iowa Checkbook (mydata.iowa.gov, Socrata dataset cyqb-8ina) " +
  "aggregated by department for the reporting month. " +
  "Revenue sourced from Iowa Tax Receipts and Refunds (dataset s98w-ib9t); " +
  "amounts converted from millions to whole dollars. " +
  "Revenue is net of refunds (receipts minus refunds per category). " +
  "Intra-governmental transfers excluded.";

/** Default end-of-month date for targeting data. */
const DEFAULT_DATE = "2026-03-31";

/** Shape returned by the Iowa Checkbook expenditure aggregation. */
interface IowaExpenditureRow {
  department: string;
  total: string;
}

/** Shape of Iowa Tax Receipts row (wide format with receipt/refund columns). */
interface IowaRevenueRow {
  fiscal_year: string;
  fiscal_month: string;
  [key: string]: string | undefined;
}

/**
 * Revenue categories: receipt column key → display name.
 * Each receipt maps to a refund column (where available) for net calculation.
 */
const REVENUE_CATEGORIES: Array<{
  name: string;
  receiptKeys: string[];
  refundKey?: string;
}> = [
  {
    name: "Individual Income Tax",
    receiptKeys: [
      "receipts_individual_income_tax_withholding",
      "receipts_individual_income_tax_estimate_payments",
      "receipts_individual_income_tax_returns",
    ],
    refundKey: "refunds_individual_income_tax",
  },
  {
    name: "Sales Tax",
    receiptKeys: ["receipts_sales_tax"],
    refundKey: "refunds_sales_tax",
  },
  {
    name: "Use Tax",
    receiptKeys: ["receipts_use_tax"],
    refundKey: "refunds_use_tax",
  },
  {
    name: "Corporation Income Tax",
    receiptKeys: ["receipts_corporation_income_tax"],
    refundKey: "refunds_corporation_income_tax",
  },
  {
    name: "Inheritance Tax",
    receiptKeys: ["receipts_inheritance_tax"],
  },
  {
    name: "Insurance Premium Tax",
    receiptKeys: ["receipts_insurance_premium_tax"],
  },
  {
    name: "Beer Tax",
    receiptKeys: ["receipts_beer_tax"],
  },
  {
    name: "Franchise Tax",
    receiptKeys: ["receipts_franchise_tax"],
  },
  {
    name: "Miscellaneous Taxes",
    receiptKeys: ["receipts_miscellaneous_taxes"],
  },
  {
    name: "Cigarette Tax",
    receiptKeys: ["receipts_cigarette_tax"],
  },
  {
    name: "Tobacco Tax",
    receiptKeys: ["receipts_tobacco_tax"],
  },
];

export class IowaImporter implements Importer {
  name = IOWA_DATASET_ID;
  description = "Iowa State Budget — monthly revenue and expenditure by department";

  private date: string;
  private readonly expenditureDataset = "cyqb-8ina";
  private readonly revenueDataset = "s98w-ib9t";
  private readonly baseUrl = "https://mydata.iowa.gov/resource";

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
      datasetId: IOWA_DATASET_ID,
      dataStatus: "pulled",
      snapshotKey,
      sourceName: IOWA_SOURCE_NAME,
      sourceUrl: IOWA_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: IOWA_TRANSFORMATION_NOTES,
    };
  }

  async fetch(): Promise<{ revenue: IowaRevenueRow[]; expenditure: IowaExpenditureRow[] }> {
    const [year, month] = this.date.split("-");
    const calMonth = parseInt(month, 10);
    // Iowa fiscal year: July=1 ... June=12
    const fiscalPeriod = calMonth >= 7 ? calMonth - 6 : calMonth + 6;
    const fiscalYear = calMonth >= 7 ? parseInt(year, 10) + 1 : parseInt(year, 10);

    const [revenue, expenditure] = await Promise.all([
      this.fetchRevenue(fiscalYear, fiscalPeriod),
      this.fetchExpenditure(fiscalYear, fiscalPeriod),
    ]);
    return { revenue, expenditure };
  }

  private async fetchExpenditure(
    fiscalYear: number,
    fiscalPeriod: number
  ): Promise<IowaExpenditureRow[]> {
    const url =
      `${this.baseUrl}/${this.expenditureDataset}.json` +
      `?$select=department,sum(amount) as total` +
      `&$where=fiscal_year='${fiscalYear}' AND fiscal_year_period='${fiscalPeriod}'` +
      `&$group=department&$limit=500&$order=total DESC`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Iowa Checkbook API error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as IowaExpenditureRow[];
  }

  private async fetchRevenue(
    fiscalYear: number,
    fiscalPeriod: number
  ): Promise<IowaRevenueRow[]> {
    // Revenue dataset uses "fiscal_month" like "9-Mar" for period 9
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Fiscal period to calendar month: period 1=Jul, 2=Aug, ..., 6=Dec, 7=Jan, ..., 12=Jun
    const calMonth = fiscalPeriod <= 6 ? fiscalPeriod + 6 : fiscalPeriod - 6;
    const monthAbbrev = monthNames[calMonth - 1];
    const fiscalMonthFilter = `${fiscalPeriod}-${monthAbbrev}`;

    const url =
      `${this.baseUrl}/${this.revenueDataset}.json` +
      `?$where=fiscal_year='${fiscalYear}' AND fiscal_month='${fiscalMonthFilter}'` +
      `&$limit=10`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Iowa Revenue API error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as IowaRevenueRow[];
  }

  transform(data: { revenue: IowaRevenueRow[]; expenditure: IowaExpenditureRow[] }): BudgetItem[] {
    const items: BudgetItem[] = [];

    // Revenue — wide-format row with receipt/refund columns (amounts in millions)
    if (data.revenue.length > 0) {
      const row = data.revenue[0];
      for (const cat of REVENUE_CATEGORIES) {
        let receipts = 0;
        for (const key of cat.receiptKeys) {
          const val = parseFloat(row[key] ?? "0");
          if (!isNaN(val)) receipts += val;
        }
        let refunds = 0;
        if (cat.refundKey) {
          const val = parseFloat(row[cat.refundKey] ?? "0");
          if (!isNaN(val)) refunds = val;
        }
        const netMillions = receipts - refunds;
        if (netMillions > 0) {
          items.push({
            type: "income",
            category: cat.name,
            amount: Math.round(netMillions * 1_000_000),
            description: `Iowa revenue — ${cat.name}`,
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
          description: `Iowa expenditure — ${department}`,
        });
      }
    }

    return items;
  }
}
