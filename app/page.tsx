import budgetCsv from "@/data/budget";
import BudgetChart from "@/components/BudgetChart";
import { ChartErrorBoundary } from "@/components/ChartErrorBoundary";
import { CsvParser } from "@/lib/parsers/csv";
import type { BudgetItem } from "@/lib/parsers";
import { formatAmount } from "@/lib/utils";

const parser = new CsvParser();
const budget = parser.read(budgetCsv) as BudgetItem[];

const totalIncome = budget
  .filter((d) => d.type === "income")
  .reduce((sum, d) => sum + d.amount, 0);

const totalSpending = budget
  .filter((d) => d.type === "spending")
  .reduce((sum, d) => sum + d.amount, 0);

const surplus = totalIncome - totalSpending;

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Treasury Income and Spending by Category
        </h2>
        <div className="bg-background-tertiary rounded-lg shadow p-4">
          <ChartErrorBoundary>
            <BudgetChart data={budget} />
          </ChartErrorBoundary>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Data Overview
        </h2>
          <p className="text-text-secondary mb-6">
            This dashboard visualizes the income and spending of the U.S. Federal Government.
          </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background-tertiary rounded-lg shadow p-6">
            <p className="text-sm text-text-muted">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              {formatAmount(totalIncome)}
            </p>
          </div>
          <div className="bg-background-tertiary rounded-lg shadow p-6">
            <p className="text-sm text-text-muted">Total Spending</p>
            <p className="text-2xl font-bold text-red-600">
              {formatAmount(totalSpending)}
            </p>
          </div>
          <div className="bg-background-tertiary rounded-lg shadow p-6">
            <p className="text-sm text-text-muted">Surplus</p>
            <p
              className={`text-2xl font-bold ${
                surplus >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatAmount(Math.abs(surplus))}
              {surplus < 0 ? " (Deficit)" : ""}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
