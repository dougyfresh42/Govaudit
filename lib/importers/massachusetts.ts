/**
 * Massachusetts state budget importer.
 *
 * Data sources:
 *   - Expenditure: CTHRU — Massachusetts Statewide Accounting System
 *     (https://cthru.data.mass.gov/). Exposes department-level expenditure
 *     data via a Socrata REST API.
 *   - Revenue: Massachusetts Department of Revenue (DOR) monthly revenue
 *     report. Published at https://www.mass.gov/orgs/massachusetts-department-of-revenue
 *     and mirrored on the state's open data portal.
 *
 * Target period: March 2026 (end-of-month date 2026-03-31)
 * Massachusetts fiscal year runs July 1 – June 30; March is period 9 of FY2026.
 *
 * Data notes:
 *   - Expenditure amounts represent actuals, not appropriations.
 *   - Revenue includes all state-source tax collections plus federal reimbursements
 *     that flow through the Comptroller's system.
 *   - MassHealth (Medicaid) federal reimbursements are included in that line.
 *
 * To refresh: npx tsx scripts/sync-budget.ts --importer massachusetts --date 2026-03-31
 */
import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig, SnapshotMeta } from "./types";

const MASSACHUSETTS_DATASET_ID = "massachusetts";
const MASSACHUSETTS_SOURCE_NAME = "Massachusetts CTHRU";
const MASSACHUSETTS_SOURCE_URL = "https://cthru.data.socrata.com/";
const MASSACHUSETTS_TRANSFORMATION_NOTES =
  "Expenditure sourced from CTHRU (Massachusetts Statewide Accounting System) " +
  "department-level actuals for the reporting month via Socrata API. " +
  "Revenue sourced from Massachusetts DOR monthly revenue report, " +
  "aggregated by tax type. " +
  "Federal reimbursements (primarily MassHealth FMAP) included in the relevant department lines. " +
  "Amounts in whole dollars; intra-governmental transfers excluded.";

/** End-of-month date targeted for March 2026 data. */
export const MASSACHUSETTS_MARCH_2026_DATE = "2026-03-31";

/** Shape returned by the CTHRU expenditure Socrata endpoint (department aggregation). */
interface CthruExpenditureRow {
  department_name: string;
  total_expenditure: string;
}

/** Shape returned by the MA DOR revenue Socrata endpoint. */
interface MaDorRevenueRow {
  revenue_type: string;
  monthly_collections: string;
}

export class MassachusettsImporter implements Importer {
  name = MASSACHUSETTS_DATASET_ID;
  description = "Massachusetts State Budget — monthly revenue and expenditure by department";

  private date: string;

  // CTHRU Socrata API base; datasets from https://cthru.data.socrata.com/
  private readonly cthruBase = "https://cthru.data.socrata.com/resource";
  // CTHRU Comptroller spending dataset (department-level actuals)
  private readonly expenditureDataset = "pegc-naaa";
  // Commonwealth Revenue Collections dataset
  private readonly revenueDataset = "kcy7-ivxi";

  constructor(config?: ImporterConfig) {
    this.date = config?.date || MASSACHUSETTS_MARCH_2026_DATE;
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
      datasetId: MASSACHUSETTS_DATASET_ID,
      dataStatus: "pulled",
      snapshotKey,
      sourceName: MASSACHUSETTS_SOURCE_NAME,
      sourceUrl: MASSACHUSETTS_SOURCE_URL,
      reportingPeriod,
      dataDate: resolvedDate,
      importedAt,
      transformationNotes: MASSACHUSETTS_TRANSFORMATION_NOTES,
    };
  }

  async fetch(): Promise<{ revenue: MaDorRevenueRow[]; expenditure: CthruExpenditureRow[] }> {
    const [year, month] = this.date.split("-");
    // MA fiscal year: July=1 ... June=12
    const calMonth = parseInt(month, 10);
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
  ): Promise<CthruExpenditureRow[]> {
    // Group expenditures by department for the target fiscal year + period.
    // CTHRU uses "budget_fiscal_year" and "fiscal_period" as filter columns.
    const url =
      `${this.cthruBase}/${this.expenditureDataset}.json` +
      `?budget_fiscal_year=${fiscalYear}&fiscal_period=${fiscalPeriod}` +
      `&$select=department as department_name,sum(amount) as total_expenditure` +
      `&$group=department&$limit=500`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CTHRU API error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as CthruExpenditureRow[];
  }

  private async fetchRevenue(fiscalYear: number, fiscalPeriod: number): Promise<MaDorRevenueRow[]> {
    // Commonwealth Revenue Collections — aggregate by revenue source.
    // CTHRU uses "fiscal_year" and "fiscal_period" (numeric) as filter columns.
    const url =
      `${this.cthruBase}/${this.revenueDataset}.json` +
      `?fiscal_year=${fiscalYear}&fiscal_period=${fiscalPeriod}` +
      `&$select=revenue_source_name as revenue_type,sum(revenue_collected) as monthly_collections` +
      `&$group=revenue_source_name&$limit=200`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`MA DOR revenue API error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as MaDorRevenueRow[];
  }

  transform(data: { revenue: MaDorRevenueRow[]; expenditure: CthruExpenditureRow[] }): BudgetItem[] {
    const items: BudgetItem[] = [];

    // Revenue
    for (const row of data.revenue) {
      const category = row.revenue_type?.trim();
      if (!category) continue;
      const amount = parseFloat((row.monthly_collections ?? "0").replace(/[,$]/g, ""));
      if (!isNaN(amount) && amount > 0) {
        items.push({
          type: "income",
          category,
          amount: Math.round(amount),
          description: `Massachusetts revenue — ${category}`,
        });
      }
    }

    // Expenditure
    for (const row of data.expenditure) {
      const department = row.department_name?.trim();
      if (!department) continue;
      const amount = parseFloat((row.total_expenditure ?? "0").replace(/[,$]/g, ""));
      if (!isNaN(amount) && amount > 0) {
        items.push({
          type: "spending",
          category: department,
          amount: Math.round(amount),
          description: `Massachusetts expenditure — ${department}`,
        });
      }
    }

    return items;
  }
}
