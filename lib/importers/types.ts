import { BudgetItem } from "../parsers";

export interface Importer {
  name: string;
  description: string;
  fetch(): Promise<unknown>;
  transform(data: unknown): BudgetItem[];
}

export interface ImporterRegistry {
  [key: string]: Importer;
}
