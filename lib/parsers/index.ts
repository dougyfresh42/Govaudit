export interface BudgetItem {
  type: "income" | "spending";
  category: string;
  amount: number;
  description: string;
}

export interface BudgetParser {
  name: string;
  read(_content: string): BudgetItem[];
  write(_data: BudgetItem[]): string;
}
