import { BudgetItem } from "../parsers";
import { Importer } from "./types";

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

  async fetch(): Promise<{ revenue: TreasuryMtsRow[]; spending: TreasuryMtsRow[] }> {
    const revenue = await this.fetchRevenue();
    const spending = await this.fetchSpending();
    return { revenue, spending };
  }

  private async fetchRevenue(): Promise<TreasuryMtsRow[]> {
    const url = `${this.baseUrl}/accounting/mts/mts_table_9?filter=record_date:eq:2024-09-30&page[size]=5000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return json.data as TreasuryMtsRow[];
  }

  private async fetchSpending(): Promise<TreasuryMtsRow[]> {
    const url = `${this.baseUrl}/accounting/mts/mts_table_3?filter=record_date:eq:2024-09-30&page[size]=5000`;
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
