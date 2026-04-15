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
import { DATASET_REGISTRY, DEFAULT_DATASET_ID } from "@/lib/importers/registry";

const parser = new CsvParser();

type Props = {
  snapshots: BudgetSnapshot[];
  defaultDatasetId?: string;
};

/**
 * Client-side dashboard. Receives all historical snapshots from the server
 * component and manages which snapshot is currently displayed.
 * Snapshots are expected newest-first; index 0 is the default current view.
 *
 * A dataset selector dropdown allows switching between supported data sources
 * (U.S. Federal, Ohio, Washington, Massachusetts, Connecticut, Florida).
 * The selected dataset filters the snapshot list; within each dataset the
 * existing reporting-period selector allows switching between historical months.
 */
export default function BudgetDashboard({
  snapshots,
  defaultDatasetId = DEFAULT_DATASET_ID,
}: Props) {
  const [selectedDatasetId, setSelectedDatasetId] = useState(defaultDatasetId);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter snapshots to the active dataset.
  const datasetSnapshots = snapshots.filter(
    (s) => s.meta.datasetId === selectedDatasetId
  );

  const handleDatasetChange = (datasetId: string) => {
    setSelectedDatasetId(datasetId);
    setSelectedIndex(0);
  };

  const selectedDataset = DATASET_REGISTRY.find((d) => d.id === selectedDatasetId);

  // ── Dataset selector (always visible) ──────────────────────────────────────
  const datasetSelector = (
    <section aria-label="Dataset selector">
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="dataset-select"
          className="text-sm text-text-secondary font-medium whitespace-nowrap"
        >
          Data source:
        </label>
        <select
          id="dataset-select"
          value={selectedDatasetId}
          onChange={(e) => handleDatasetChange(e.target.value)}
          className="rounded border border-gray-300 bg-background-tertiary text-text-primary text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {DATASET_REGISTRY.map((d) => (
            <option key={d.id} value={d.id}>
              {d.displayName}
              {!d.isAvailable ? " (coming soon)" : ""}
            </option>
          ))}
        </select>
        {selectedDataset && (
          <span className="text-xs text-text-muted hidden sm:inline">
            {selectedDataset.description}
          </span>
        )}
      </div>
    </section>
  );

  // ── No snapshots for this dataset ──────────────────────────────────────────
  if (datasetSnapshots.length === 0) {
    return (
      <div className="space-y-6">
        {datasetSelector}
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
          <p className="text-text-secondary font-medium mb-1">
            Data not yet available for {selectedDataset?.displayName ?? selectedDatasetId}
          </p>
          <p className="text-text-muted text-sm">
            The importer for this dataset is scaffolded and targeting March 2026 data.
            Check back after the next import run, or{" "}
            <a
              href={selectedDataset?.sourceUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-text-primary"
            >
              view the source directly
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  const snapshot = datasetSnapshots[selectedIndex];
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
      {/* Dataset selector */}
      {datasetSelector}

      {/* Snapshot selector — only shown when more than one snapshot is available */}
      {datasetSnapshots.length > 1 && (
        <section aria-label="Snapshot selector">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-text-secondary font-medium">Reporting Period:</span>
            {datasetSnapshots.map((s, i) => (
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
          This dashboard visualizes the income and spending of{" "}
          {selectedDataset?.displayName ?? "the selected government entity"}.
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
