import React from "react";
import type { SnapshotMeta, DataStatus } from "@/lib/importers/types";

type Props = {
  meta: SnapshotMeta;
};

const STATUS_LABEL: Record<DataStatus, string> = {
  pulled: "Live Data",
  stub: "Placeholder Data",
};

const STATUS_CLASSES: Record<DataStatus, string> = {
  pulled:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-300 dark:border-green-700",
  stub: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700",
};

/** Renders provenance metadata for a budget snapshot as a footnote panel. */
export default function DataSourceInfo({ meta }: Props) {
  return (
    <aside
      aria-label="Data source information"
      className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-text-muted space-y-1"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <p className="font-semibold text-text-secondary text-sm">Data Source</p>
        <span
          aria-label={`Data status: ${STATUS_LABEL[meta.dataStatus]}`}
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASSES[meta.dataStatus]}`}
        >
          {STATUS_LABEL[meta.dataStatus]}
        </span>
        {meta.dataStatus === "stub" && (
          <span className="text-xs text-amber-700 dark:text-amber-400 italic">
            — figures are estimates, not sourced from the live API
          </span>
        )}
      </div>
      <p>
        <span className="font-medium">Source: </span>
        <a
          href={meta.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-text-primary"
        >
          {meta.sourceName}
        </a>
      </p>
      <p>
        <span className="font-medium">Reporting Period: </span>
        {meta.reportingPeriod}
      </p>
      <p>
        <span className="font-medium">Data Date: </span>
        {meta.dataDate}
      </p>
      <p>
        <span className="font-medium">Imported: </span>
        {new Date(meta.importedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        })}
      </p>
      <p>
        <span className="font-medium">Transformations: </span>
        {meta.transformationNotes}
      </p>
    </aside>
  );
}
