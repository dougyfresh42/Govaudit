"use client";

import React, { useState } from "react";
import type { BudgetSnapshot } from "@/lib/importers/types";
import type { BudgetItem } from "@/lib/parsers";
import { CsvParser } from "@/lib/parsers/csv";
import { formatAmount } from "@/lib/utils";
import { ChartErrorBoundary } from "@/components/ChartErrorBoundary";
import IncomeSpendingMeter from "@/components/IncomeSpendingMeter";
import BudgetPieChart from "@/components/BudgetPieChart";
import DataSourceInfo from "@/components/DataSourceInfo";

const parser = new CsvParser();

type Props = {
  snapshots: BudgetSnapshot[];
};

/**
 * Client-side dashboard. Receives all historical snapshots from the server
 * component and manages which snapshot is currently displayed.
 * Snapshots are expected newest-first; index 0 is the default current view.
 */
export default function BudgetDashboard({ snapshots }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const snapshot = snapshots[selectedIndex];
  const budget = parser.read(snapshot.csv) as BudgetItem[];

  const totalIncome = budget
    .filter((d) => d.type === "income" && d.amount > 0)
    .reduce((sum, d) => sum + d.amount, 0);

  // Some spending entries are negative (e.g. agencies that returned funds); exclude them from totals.
  const totalSpending = budget
    .filter((d) => d.type === "spending" && d.amount > 0)
    .reduce((sum, d) => sum + d.amount, 0);

  const surplus = totalIncome - totalSpending;

  return (
    <div className="space-y-6">
      {/* Snapshot selector — only shown when more than one snapshot is available */}
      {snapshots.length > 1 && (
        <section aria-label="Snapshot selector">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-text-secondary font-medium">Reporting Period:</span>
            {snapshots.map((s, i) => (
              <button
                key={s.meta.snapshotKey}
                onClick={() => setSelectedIndex(i)}
                aria-pressed={i === selectedIndex}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  i === selectedIndex
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-background-tertiary text-text-secondary border-gray-300 hover:border-blue-400"
                }`}
              >
                {s.meta.reportingPeriod}
                {i === 0 && (
                  <span className="ml-1 text-xs opacity-75">(latest)</span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

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

      {/* Data source provenance */}
      <DataSourceInfo meta={snapshot.meta} />
    </div>
  );
}
