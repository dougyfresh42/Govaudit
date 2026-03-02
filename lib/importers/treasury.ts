import { BudgetItem } from "../parsers";
import { Importer, ImporterConfig } from "./types";

interface TreasuryMtsRow {
  record_date: string;
  classification_desc: string;
  src_line_nbr: string;
  current_month_rcpt_outly_amt: string;
}

export class TreasuryImporter implements Importer {
  name = "treasury";
  description = "U.S. Federal Budget - Latest available month by category";

  private baseUrl = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1";
  private date: string;
  private cachedDate: string | null = null;

  constructor(config?: ImporterConfig) {
    this.date = config?.date || "latest";
  }

  async fetch(): Promise<{ revenue: TreasuryMtsRow[]; spending: TreasuryMtsRow[] }> {
    const filterDate = await this.getTargetDate();
    const revenue = await this.fetchRevenue(filterDate);
    const spending = await this.fetchSpending(filterDate);
    return { revenue, spending };
  }

  private async getTargetDate(): Promise<string> {
    if (this.date === "latest") {
      if (this.cachedDate) {
        return this.cachedDate;
      }
      const latestDate = await this.fetchLatestDate();
      this.cachedDate = latestDate;
      return latestDate;
    }
    return this.date;
  }

  private async fetchLatestDate(): Promise<string> {
    const url = `${this.baseUrl}/accounting/mts/mts_table_9?page[size]=1&sort=-record_date`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    if (!json.data || json.data.length === 0) {
      throw new Error("No data available from Treasury API");
    }
    return json.data[0].record_date;
  }

  private async fetchRevenue(date: string): Promise<TreasuryMtsRow[]> {
    const url = `${this.baseUrl}/accounting/mts/mts_table_9?filter=record_date:eq:${date}&page[size]=5000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return json.data as TreasuryMtsRow[];
  }

  private async fetchSpending(date: string): Promise<TreasuryMtsRow[]> {
    const url = `${this.baseUrl}/accounting/mts/mts_table_3?filter=record_date:eq:${date}&page[size]=5000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return json.data as TreasuryMtsRow[];
  }

  transform(data: { revenue: TreasuryMtsRow[]; spending: TreasuryMtsRow[] }): BudgetItem[] {
    const items: BudgetItem[] = [];

    const revenueByCategory = new Map<string, number>();
    for (const row of data.revenue) {
      const category = row.classification_desc;
      if (!category) continue;
      
      const validRevenue = [
        "Individual Income Taxes",
        "Corporation Income Taxes",
        "Employment and General Retirement",
        "Unemployment Insurance",
        "Other Retirement",
        "Excise Taxes",
        "Estate and Gift Taxes",
        "Customs Duties",
        "Miscellaneous Receipts",
      ];
      
      if (validRevenue.includes(category)) {
        const amount = parseFloat(row.current_month_rcpt_outly_amt.replace(/,/g, ""));
        if (!isNaN(amount)) {
          const current = revenueByCategory.get(category) || 0;
          revenueByCategory.set(category, current + amount);
        }
      }
    }

    for (const [category, amount] of revenueByCategory) {
      items.push({
        type: "income",
        category: category,
        amount: Math.round(amount),
        description: `Federal revenue - ${category}`,
      });
    }

    const spendingByCategory = new Map<string, number>();
    const excludeSpending = [
      "Budget Receipts",
      "Budget Outlays",
      "Total Receipts",
      "Total Outlays",
      "Surplus (+) or Deficit (-)",
      "(On-Budget)",
      "(Off-Budget)",
      "Interest",
      "Individual Income Taxes",
      "Corporation Income Taxes",
      "Social Insurance and Retirement Receipts:",
      "Employment and General Retirement (Off-Budget)",
      "Employment and General Retirement (On-Budget)",
      "Unemployment Insurance",
      "Other Retirement",
      "Excise Taxes",
      "Estate and Gift Taxes",
      "Customs Duties",
      "Miscellaneous Receipts",
      "Undistributed Offsetting Receipts:",
    ];
    
    for (const row of data.spending) {
      const category = row.classification_desc;
      if (!category || excludeSpending.includes(category)) continue;
      
      const amount = parseFloat(row.current_month_rcpt_outly_amt.replace(/,/g, ""));
      if (!isNaN(amount)) {
        const current = spendingByCategory.get(category) || 0;
        spendingByCategory.set(category, current + amount);
      }
    }

    for (const [category, amount] of spendingByCategory) {
      items.push({
        type: "spending",
        category: category,
        amount: Math.round(amount),
        description: `Federal spending - ${category}`,
      });
    }

    return items;
  }
}
