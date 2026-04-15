import React from "react";
import type { SnapshotMeta } from "@/lib/importers/types";

type Props = {
  meta: SnapshotMeta;
};

/** Renders provenance metadata for a budget snapshot as a footnote panel. */
export default function DataSourceInfo({ meta }: Props) {
  return (
    <aside
      aria-label="Data source information"
      className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-text-muted space-y-1"
    >
      <p className="font-semibold text-text-secondary text-sm">Data Source</p>
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
