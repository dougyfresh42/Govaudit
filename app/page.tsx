import budgetCsv from "@/data/budget";
import { ChartErrorBoundary } from "@/components/ChartErrorBoundary";
import { CsvParser } from "@/lib/parsers/csv";
import type { BudgetItem } from "@/lib/parsers";
import { formatAmount } from "@/lib/utils";
import IncomeSpendingMeter from "@/components/IncomeSpendingMeter";
import BudgetPieChart from "@/components/BudgetPieChart";

const parser = new CsvParser();
const budget = parser.read(budgetCsv) as BudgetItem[];

const totalIncome = budget
  .filter((d) => d.type === "income")
  .reduce((sum, d) => sum + d.amount, 0);

const totalSpending = budget
  .filter((d) => d.type === "spending" && d.amount > 0)
  .reduce((sum, d) => sum + d.amount, 0);

const surplus = totalIncome - totalSpending;

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Income vs Spending meter */}
      <section>
        <ChartErrorBoundary>
          <IncomeSpendingMeter
            totalIncome={totalIncome}
            totalSpending={totalSpending}
          />
        </ChartErrorBoundary>
      </section>

      {/* Summary cards */}
      <section>
        <p className="text-text-secondary mb-4 text-sm sm:text-base">
          This dashboard visualizes the income and spending of the U.S. Federal Government.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-background-tertiary rounded-lg shadow p-4 sm:p-6">
            <p className="text-sm text-text-muted">Total Income</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {formatAmount(totalIncome)}
            </p>
          </div>
          <div className="bg-background-tertiary rounded-lg shadow p-4 sm:p-6">
            <p className="text-sm text-text-muted">Total Spending</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">
              {formatAmount(totalSpending)}
            </p>
          </div>
          <div className="bg-background-tertiary rounded-lg shadow p-4 sm:p-6">
            <p className="text-sm text-text-muted">{surplus >= 0 ? "Surplus" : "Deficit"}</p>
            <p
              className={`text-xl sm:text-2xl font-bold ${
                surplus >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatAmount(Math.abs(surplus))}
            </p>
          </div>
        </div>
      </section>

      {/* Pie charts */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">
          Budget Breakdown
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartErrorBoundary>
            <BudgetPieChart
              data={budget}
              type="income"
              title="Income by Category"
            />
          </ChartErrorBoundary>
          <ChartErrorBoundary>
            <BudgetPieChart
              data={budget}
              type="spending"
              title="Spending by Department"
            />
          </ChartErrorBoundary>
        </div>
      </section>
    </div>
  );
}
