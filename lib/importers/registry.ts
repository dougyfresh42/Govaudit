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
    description: "Connecticut state budget — revenues and expenditures via CT Open Data.",
    sourceUrl: "https://data.ct.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: true,
  },
  {
    id: "florida",
    displayName: "Florida",
    description: "Florida state budget — revenues and expenditures via Transparency Florida.",
    sourceUrl: "https://transparency.myflorida.com/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "alabama",
    displayName: "Alabama",
    description: "Alabama state budget — revenues and expenditures via Alabama Open Data.",
    sourceUrl: "https://open.alabama.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "alaska",
    displayName: "Alaska",
    description: "Alaska state budget — revenues and expenditures via Alaska OMB.",
    sourceUrl: "https://omb.alaska.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "arizona",
    displayName: "Arizona",
    description: "Arizona state budget — revenues and expenditures via Arizona OpenBooks.",
    sourceUrl: "https://openbooks.az.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "arkansas",
    displayName: "Arkansas",
    description: "Arkansas state budget — revenues and expenditures via Arkansas DFA Transparency.",
    sourceUrl: "https://www.ark.org/dfa/transparency/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "california",
    displayName: "California",
    description: "California state budget — revenues and expenditures via CA State Controller.",
    sourceUrl: "https://bythenumbers.sco.ca.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "colorado",
    displayName: "Colorado",
    description: "Colorado state budget — revenues and expenditures via Colorado Open Data.",
    sourceUrl: "https://data.colorado.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "delaware",
    displayName: "Delaware",
    description: "Delaware state budget — revenues and expenditures via Delaware Open Data.",
    sourceUrl: "https://data.delaware.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "georgia",
    displayName: "Georgia",
    description: "Georgia state budget — revenues and expenditures via Open Georgia.",
    sourceUrl: "https://open.georgia.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "hawaii",
    displayName: "Hawaii",
    description: "Hawaii state budget — revenues and expenditures via Hawaii Open Data.",
    sourceUrl: "https://data.hawaii.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "idaho",
    displayName: "Idaho",
    description: "Idaho state budget — revenues and expenditures via Idaho Transparent Government.",
    sourceUrl: "https://transparent.idaho.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "illinois",
    displayName: "Illinois",
    description: "Illinois state budget — revenues and expenditures via Illinois Open Data.",
    sourceUrl: "https://data.illinois.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "indiana",
    displayName: "Indiana",
    description: "Indiana state budget — revenues and expenditures via Indiana Transparency Portal.",
    sourceUrl: "https://www.in.gov/itp/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "iowa",
    displayName: "Iowa",
    description: "Iowa state budget — revenues and expenditures via Iowa Open Data.",
    sourceUrl: "https://mydata.iowa.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: true,
  },
  {
    id: "kansas",
    displayName: "Kansas",
    description: "Kansas state budget — revenues and expenditures via Kansas KanView.",
    sourceUrl: "https://kanview.ks.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "kentucky",
    displayName: "Kentucky",
    description: "Kentucky state budget — revenues and expenditures via Kentucky Open Doors.",
    sourceUrl: "https://transparency.ky.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "louisiana",
    displayName: "Louisiana",
    description: "Louisiana state budget — revenues and expenditures via Louisiana LaTrac.",
    sourceUrl: "https://wwwprd.doa.louisiana.gov/LaTrac/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "maine",
    displayName: "Maine",
    description: "Maine state budget — revenues and expenditures via Maine state portal.",
    sourceUrl: "https://www.maine.gov/budget/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "maryland",
    displayName: "Maryland",
    description: "Maryland state budget — revenues and expenditures via Maryland Open Data.",
    sourceUrl: "https://data.maryland.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "michigan",
    displayName: "Michigan",
    description: "Michigan state budget — revenues and expenditures via Michigan Open Data.",
    sourceUrl: "https://data.michigan.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "minnesota",
    displayName: "Minnesota",
    description: "Minnesota state budget — revenues and expenditures via MN Management and Budget.",
    sourceUrl: "https://mn.gov/mmb/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "mississippi",
    displayName: "Mississippi",
    description: "Mississippi state budget — revenues and expenditures via Mississippi DFA.",
    sourceUrl: "https://www.ms.gov/dfa/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "missouri",
    displayName: "Missouri",
    description: "Missouri state budget — revenues and expenditures via Missouri Open Data.",
    sourceUrl: "https://data.mo.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "montana",
    displayName: "Montana",
    description: "Montana state budget — revenues and expenditures via Montana Transparency.",
    sourceUrl: "https://montana.gov/transparency/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "nebraska",
    displayName: "Nebraska",
    description: "Nebraska state budget — revenues and expenditures via Nebraska state portal.",
    sourceUrl: "https://statewide.das.nebraska.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "nevada",
    displayName: "Nevada",
    description: "Nevada state budget — revenues and expenditures via Nevada Open Data.",
    sourceUrl: "https://opendata.nv.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "new-hampshire",
    displayName: "New Hampshire",
    description: "New Hampshire state budget — revenues and expenditures via Transparent NH.",
    sourceUrl: "https://www.nh.gov/transparentnh/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "new-jersey",
    displayName: "New Jersey",
    description: "New Jersey state budget — revenues and expenditures via NJ Open Data.",
    sourceUrl: "https://data.nj.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "new-mexico",
    displayName: "New Mexico",
    description: "New Mexico state budget — revenues and expenditures via NM Sunshine Portal.",
    sourceUrl: "https://sunshineportalnm.com/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "new-york",
    displayName: "New York",
    description: "New York state budget — revenues and expenditures via NY Open Data.",
    sourceUrl: "https://data.ny.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "north-carolina",
    displayName: "North Carolina",
    description: "North Carolina state budget — revenues and expenditures via NC Transparency.",
    sourceUrl: "https://www.nc.gov/transparency",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "north-dakota",
    displayName: "North Dakota",
    description: "North Dakota state budget — revenues and expenditures via ND OMB.",
    sourceUrl: "https://www.nd.gov/omb/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "oklahoma",
    displayName: "Oklahoma",
    description: "Oklahoma state budget — revenues and expenditures via Oklahoma OMES.",
    sourceUrl: "https://oklahoma.gov/omes/services/budget.html",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "oregon",
    displayName: "Oregon",
    description: "Oregon state budget — revenues and expenditures via Oregon Open Data.",
    sourceUrl: "https://data.oregon.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "pennsylvania",
    displayName: "Pennsylvania",
    description: "Pennsylvania state budget — revenues and expenditures via PA Open Data.",
    sourceUrl: "https://data.pa.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "rhode-island",
    displayName: "Rhode Island",
    description: "Rhode Island state budget — revenues and expenditures via RI Transparency.",
    sourceUrl: "https://transparency.ri.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "south-carolina",
    displayName: "South Carolina",
    description: "South Carolina state budget — revenues and expenditures via SC Comptroller General.",
    sourceUrl: "https://cg.sc.gov/fiscal-transparency",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "south-dakota",
    displayName: "South Dakota",
    description: "South Dakota state budget — revenues and expenditures via SD Open Government.",
    sourceUrl: "https://open.sd.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "tennessee",
    displayName: "Tennessee",
    description: "Tennessee state budget — revenues and expenditures via Tennessee Open Data.",
    sourceUrl: "https://data.tn.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "texas",
    displayName: "Texas",
    description: "Texas state budget — revenues and expenditures via Texas Open Data.",
    sourceUrl: "https://data.texas.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "utah",
    displayName: "Utah",
    description: "Utah state budget — revenues and expenditures via Utah Open Data.",
    sourceUrl: "https://opendata.utah.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "vermont",
    displayName: "Vermont",
    description: "Vermont state budget — revenues and expenditures via Vermont Open Data.",
    sourceUrl: "https://data.vermont.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "virginia",
    displayName: "Virginia",
    description: "Virginia state budget — revenues and expenditures via Virginia Open Data.",
    sourceUrl: "https://data.virginia.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "west-virginia",
    displayName: "West Virginia",
    description: "West Virginia state budget — revenues and expenditures via WV Finance.",
    sourceUrl: "https://finance.wv.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "wisconsin",
    displayName: "Wisconsin",
    description: "Wisconsin state budget — revenues and expenditures via Wisconsin OpenBook.",
    sourceUrl: "https://openbook.wi.gov/",
    targetDataDate: "2026-03-31",
    isAvailable: false,
  },
  {
    id: "wyoming",
    displayName: "Wyoming",
    description: "Wyoming state budget — revenues and expenditures via Wyoming state portal.",
    sourceUrl: "https://ai.wyo.gov/",
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
