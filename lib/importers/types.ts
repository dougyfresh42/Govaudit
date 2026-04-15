import { BudgetItem } from "../parsers";

/** Provenance and context metadata attached to every import snapshot. */
export interface SnapshotMeta {
  /** Unique identifier for this snapshot, formatted as "YYYY-MM". */
  snapshotKey: string;
  /**
   * Identifier for the dataset this snapshot belongs to (e.g. "treasury", "ohio").
   * Omitting this field is treated as "treasury" for backward compatibility.
   */
  datasetId?: string;
  /** Human-readable display name for the data source. */
  sourceName: string;
  /** Canonical URL of the data source or dataset landing page. */
  sourceUrl: string;
  /** Human-readable reporting period, e.g. "January 2026". */
  reportingPeriod: string;
  /** ISO 8601 date of the source record, e.g. "2026-01-31". */
  dataDate: string;
  /** ISO 8601 datetime when this import was run. */
  importedAt: string;
  /** Plain-English notes describing transformations applied to the raw data. */
  transformationNotes: string;
}

/** A single import snapshot: provenance metadata plus the raw CSV payload. */
export interface BudgetSnapshot {
  meta: SnapshotMeta;
  csv: string;
}

export interface Importer {
  name: string;
  description: string;
  fetch(): Promise<unknown>;
  transform(_data: unknown): BudgetItem[];
  /** Return provenance metadata for the most recent fetch. Call after fetch(). */
  getMetadata?(_resolvedDate: string, _importedAt: string): SnapshotMeta;
}

export interface ImporterConfig {
  date?: string;
}

export interface ImporterRegistry {
  [key: string]: Importer;
}
