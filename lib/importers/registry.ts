/**
 * Dataset registry — the single source of truth for all supported data sources.
 * Add a new entry here when adding a new state importer, then create the corresponding
 * importer module in this directory and register it in index.ts.
 */
export interface DatasetEntry {
  /** Stable identifier used in importer names, snapshot meta, and URL params. */
  id: string;
  /** User-facing label shown in the dataset selector dropdown. */
  displayName: string;
  /** Short description shown alongside the selector. */
  description: string;
  /** Canonical URL for the data source landing page. */
  sourceUrl: string;
  /**
   * ISO 8601 date targeted for March 2026 data (YYYY-MM-DD).
   * If March 2026 is not yet available the nearest available date is used
   * and fallbackNote documents the reason.
   */
  targetDataDate: string;
  /**
   * Human-readable note explaining why a fallback date is used instead of
   * March 2026. Omit when targetDataDate is the actual March 2026 end-of-month date.
   */
  fallbackNote?: string;
  /** True when the importer has real data; false for stubs awaiting implementation. */
  isAvailable: boolean;
}

export const DATASET_REGISTRY: DatasetEntry[] = [
  {
    id: "treasury",
    displayName: "U.S. Federal Budget",
    description: "Monthly Treasury Statement (MTS) — federal receipts and outlays by agency.",
    sourceUrl: "https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/",
    targetDataDate: "2026-03-31",
    isAvailable: true,
  },
  {
    id: "ohio",
    displayName: "Ohio",
    description: "Ohio state budget — revenues and expenditures via Ohio Checkbook.",
    sourceUrl: "https://ohiocheckbook.ohio.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "washington",
    displayName: "Washington",
    description: "Washington state budget — revenues and expenditures via WA Fiscal Transparency.",
    sourceUrl: "https://fiscal.wa.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "massachusetts",
    displayName: "Massachusetts",
    description: "Massachusetts state budget — revenues and expenditures via CTHRU.",
    sourceUrl: "https://cthru.data.socrata.com/",
    targetDataDate: "2026-03-31",
    isAvailable: true,
  },
  {
    id: "connecticut",
    displayName: "Connecticut",
    description: "Connecticut state budget — revenues and expenditures via Open Budget CT.",
    sourceUrl: "https://openbudget.ct.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "florida",
    displayName: "Florida",
    description: "Florida state budget — revenues and expenditures via Transparency Florida.",
    sourceUrl: "https://transparency.myflorida.com/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
];

/** Look up a dataset entry by its stable id. Returns undefined if not found. */
export function getDatasetEntry(id: string): DatasetEntry | undefined {
  return DATASET_REGISTRY.find((d) => d.id === id);
}

/** The default dataset id shown when no selection has been made. */
export const DEFAULT_DATASET_ID = "treasury";
