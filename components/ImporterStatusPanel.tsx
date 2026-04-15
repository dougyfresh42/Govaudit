import React from "react";
import type { BudgetSnapshot, DataStatus } from "@/lib/importers/types";
import type { DatasetEntry } from "@/lib/importers/registry";

type Props = {
  registry: DatasetEntry[];
  snapshots: BudgetSnapshot[];
};

const STATUS_BADGE: Record<DataStatus, { label: string; classes: string }> = {
  pulled: {
    label: "Live Data",
    classes:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-300 dark:border-green-700",
  },
  stub: {
    label: "Placeholder",
    classes:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700",
  },
};

const AVAILABLE_BADGE = {
  label: "Coming Soon",
  classes:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-300 dark:border-gray-600",
};

function formatImportedAt(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ImporterStatusPanel({ registry, snapshots }: Props) {
  return (
    <div className="space-y-4">
      {registry.map((dataset) => {
        const datasetSnapshots = snapshots.filter(
          (s) => s.meta.datasetId === dataset.id
        );
        // Sort snapshots newest-first by snapshotKey (YYYY-MM lexicographic)
        const sorted = [...datasetSnapshots].sort((a, b) =>
          b.meta.snapshotKey.localeCompare(a.meta.snapshotKey)
        );
        const latest = sorted[0];
        const hasData = sorted.length > 0;

        // Determine badge
        let badge: { label: string; classes: string };
        if (!hasData) {
          badge = AVAILABLE_BADGE;
        } else {
          badge = STATUS_BADGE[latest.meta.dataStatus];
        }

        return (
          <div
            key={dataset.id}
            className="bg-background-tertiary rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 sm:p-5"
          >
            {/* Header row */}
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <h2 className="text-base font-semibold text-text-primary">
                  {dataset.displayName}
                </h2>
                <p className="text-xs text-text-muted mt-0.5">{dataset.description}</p>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${badge.classes}`}
              >
                {badge.label}
              </span>
            </div>

            {/* Details grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs mt-3">
              <div className="flex gap-1">
                <dt className="font-medium text-text-secondary">Source:</dt>
                <dd>
                  <a
                    href={dataset.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    {dataset.sourceUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </dd>
              </div>

              <div className="flex gap-1">
                <dt className="font-medium text-text-secondary">Snapshots:</dt>
                <dd className="text-text-primary">{sorted.length}</dd>
              </div>

              {latest && (
                <>
                  <div className="flex gap-1">
                    <dt className="font-medium text-text-secondary">Last Imported:</dt>
                    <dd className="text-text-primary">{formatImportedAt(latest.meta.importedAt)}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-medium text-text-secondary">Latest Period:</dt>
                    <dd className="text-text-primary">{latest.meta.reportingPeriod}</dd>
                  </div>
                </>
              )}
            </dl>

            {/* Snapshot date pills */}
            {sorted.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-text-secondary mb-1">Available dates:</p>
                <div className="flex flex-wrap gap-1.5">
                  {sorted.map((s) => {
                    const isStub = s.meta.dataStatus === "stub";
                    return (
                      <span
                        key={s.meta.snapshotKey}
                        title={isStub ? "Placeholder data" : "Live data"}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${
                          isStub
                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700"
                            : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
                        }`}
                      >
                        {s.meta.reportingPeriod}
                        {isStub && (
                          <span aria-label="placeholder" className="opacity-60">
                            ⚠
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {!hasData && (
              <p className="mt-3 text-xs text-text-muted italic">
                No snapshots imported yet. Importer is scaffolded and targeting{" "}
                {dataset.targetDataDate}.
                {dataset.fallbackNote && ` Note: ${dataset.fallbackNote}`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
