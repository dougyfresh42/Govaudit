export interface BudgetItem {
  type: "income" | "spending";
  category: string;
  amount: number;
  description: string;
}

export interface BudgetParser {
  name: string;
  read(content: string): BudgetItem[];
  write(data: BudgetItem[]): string;
}
