import { BudgetItem } from "../parsers";

export interface Importer {
  name: string;
  description: string;
  fetch(): Promise<unknown>;
  transform(_data: unknown): BudgetItem[];
}

export interface ImporterConfig {
  date?: string;
}

export interface ImporterRegistry {
  [key: string]: Importer;
}
