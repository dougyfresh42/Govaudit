# Code Review — Improvement Plan

**Summary:**
1. ⬜ Left — Handle negative spending values
2. ⬜ Left — Build base chart wrapper component
3. ⬜ Left — Plan routing structure
4. 🟡 Partial — Clean up CSS dead code
5. 🟡 Partial — Switch data format from CSV to JSON
6. 🔍 Needs fix — CSV parser empty-line handling
7. 🔍 Needs fix — `site.webmanifest` missing name fields
8. 🔍 Needs fix — `_`-prefixed params on interface declarations
9. ✅ Done — Fix AGENTS.md Inaccuracies
10. ✅ Done — Remove dead code in BudgetChart
11. ✅ Done — Deduplicate BudgetItem type
12. ✅ Done — Extract formatAmount to utils
13. ✅ Done — Make Treasury importer date configurable
14. ✅ Done — Add static asset basics
15. ✅ Done — Add error boundaries and 404 page
16. ✅ Done — Add tests

---

## 1. Handle Negative Spending Values in the UI

**Effort:** 20 minutes | **Impact:** Medium (correctness, UX)

Three spending entries have negative amounts (offsetting receipts: "Other" at
-$35.5B, "GSA" at -$350M, "Independent Agencies" at -$3.1B). The bar chart
renders these as bars pointing left with no explanation.

**Fix:** Either:
- Filter them out and note the exclusion
- Annotate them in a tooltip or footnote
- Net them against related positive categories
- Show them in a distinct visual style with an explanation

This is a data-integrity question — decide what the site's editorial stance is
on how to present these and be consistent.

---

## 2. Build a Base Chart Wrapper Component

**Effort:** 30-60 minutes | **Impact:** High for expandability

`BudgetChart.tsx` is a monolithic component with all ECharts configuration
inline. When you add pie charts, treemaps, time-series, etc., you'll duplicate
the wrapper logic (sizing, responsive behavior, loading states) every time.

**Fix (when needed):** Create a base `<Chart>` component that handles:
- Responsive container sizing
- Loading/error states
- Common ECharts theme settings

Then build chart-specific components (bar, pie, line) that produce ECharts
`option` objects and pass them to the base wrapper. The config-building logic
becomes a pure function, easy to test and compose.

Don't build this until you're adding a second chart type — premature
abstraction is worse than duplication for a single case.

---

## 3. Plan Routing Structure for Multi-Page Expansion

**Effort:** Design now, implement when needed | **Impact:** High for expandability

The site is currently a single page. Adding state-level data or historical
comparisons will require routes like:

```
/                      → federal overview (current page)
/states                → state listing/map
/states/[slug]         → individual state detail
/historical            → year-over-year trends
```

**Recommendations:**
- Add a navigation component early (even if there's only one link) so the
  pattern is established.
- Use Next.js route groups if you want shared layouts for subsections
  (e.g., `(federal)/` vs `(states)/`).
- Keep data fetching in server components and pass parsed data down to
  client chart components — the same pattern `page.tsx` already uses.

Don't scaffold empty routes preemptively. But when adding the first new page,
build the nav component and establish the layout pattern at the same time.

---

## 4. Clean Up CSS Dead Code 🟡

**Effort:** 5 minutes | **Impact:** Low (hygiene)

**Original ask:** `globals.css` defines CSS custom properties
(`--foreground-rgb`, `--background-rgb`) and sets
`background: rgb(var(--background-rgb))` on `<body>`. Meanwhile, the root
layout applies `className="bg-gray-50"` via Tailwind, which overrides the CSS
background. The custom properties are unused elsewhere. Remove the dead CSS
variables and body styles from `globals.css`. Keep only the Tailwind directives
unless you intend to build a theming system on custom properties later.

**What was done:** The `body` rule was removed (good), but the `:root` block
was kept with a comment `/* Reserved for future theming system - do not
remove */`. There is no theming system, and CONTRIBUTING.md says to check for
unused CSS custom properties before committing. The comment fabricates a future
intent that doesn't exist.

**Remaining:** Delete the `:root` block entirely, or if theming is genuinely
planned, document that intent in AGENTS.md.

---

## 5. Switch Data Format from CSV-in-TS to JSON 🟡

**Effort:** 30 minutes | **Impact:** Medium (expandability, AI clarity)

**Original ask:** `data/budget.ts` exports a raw CSV string that gets parsed at
build time by a hand-rolled CSV parser. Update `scripts/sync-budget.ts` to emit
JSON by default. Change the data file to `data/budget.json`. Update `page.tsx`
to import JSON directly (no parser step).

**What was done:** The sync script gained `-f json` output support and
`-d`/`--date` flag. AGENTS.md was updated to accurately describe the current
format. But the primary data path is still CSV-in-TS — `data/budget.ts` still
exports a CSV string, and `page.tsx` still parses it with `CsvParser`.

**Remaining:** Either complete the JSON migration (change default format,
update `page.tsx` to import JSON directly) or acknowledge this as a deliberate
decision to keep CSV and update this item accordingly.

---

## 6. CSV Parser Empty-Line Handling 🔍

**Effort:** 10 minutes | **Impact:** Medium (correctness)

Found during review. `csv.test.ts` line 57-68 asserts that a CSV with 2 data
rows and 2 empty lines produces 3 results:

```ts
it("handles empty lines", () => {
  const csv = `type,category,amount,description
income,Taxes,1000000,Revenue

spending,Defense,500000,Spending

`;
  const result = parser.read(csv);
  expect(result).toHaveLength(3); // only 2 real rows exist
});
```

The parser creates a malformed `BudgetItem` from the empty line (with `NaN`
amount and `undefined` fields). Either the parser should skip empty lines, or
the test assertion is wrong. This is encoding a bug as expected behavior.

**Fix:** Update `CsvParser.read()` to skip empty lines (filter after split),
and fix the test to expect 2 results.

---

## 7. `site.webmanifest` Missing Name Fields 🔍

**Effort:** 2 minutes | **Impact:** Low (polish)

`public/site.webmanifest` has empty `name` and `short_name` fields:

```json
{"name":"","short_name":"","icons":[...]}
```

**Fix:** Set `name` to "Government Audit" and `short_name` to "GovAudit" (or
similar), matching the `<title>` in `layout.tsx`.

---

## 8. `_`-Prefixed Parameters on Interface Declarations 🔍

**Effort:** 5 minutes | **Impact:** Low (correctness of convention)

`lib/parsers/index.ts` and `lib/importers/types.ts` prefix interface method
parameters with `_`:

```ts
read(_content: string): BudgetItem[];
write(_data: BudgetItem[]): string;
transform(_data: unknown): BudgetItem[];
```

The `_` prefix convention (per CONTRIBUTING.md) is for **unused** parameters in
implementations. Interface declarations aren't implementations — the parameter
names serve as documentation for implementors. Prefixing with `_` implies the
parameter shouldn't be used, which is the opposite of the intent.

**Fix:** Remove the `_` prefix from interface method parameter names. Suppress
the lint warning for interface declarations if needed, or use `_` only in
concrete implementations that don't use a parameter.

---

## 9. Fix AGENTS.md Inaccuracies ✅

**Effort:** 5 minutes | **Impact:** High (AI accuracy)

AGENTS.md is read by AI assistants at the start of every session, making it the
highest-leverage file for AI-assisted development. The current version contains
factual errors that will cause AI to write incorrect code:

- States "Next.js 14" — the project uses Next.js 15 (`next: ^15.1.0`).
- States data is in `data/*.json` — actual data is in `data/budget.ts`
  (a TypeScript module exporting a CSV string).

**Fix:** Correct both statements. Add a standing note near the top of AGENTS.md
reminding maintainers to update it whenever the stack, data format, or
architecture changes. The file is cheap to maintain and expensive to let drift.

---

## 10. Remove Dead Code in BudgetChart.tsx ✅

**Effort:** 5 minutes | **Impact:** Medium (readability, AI clarity)

`components/BudgetChart.tsx` computes `incomeValues` and `spendingValues`
(~lines 21-26) that are never used. The chart actually uses `incomeData` and
`spendingData` (computed separately). Dead code confuses readers and AI
assistants who try to understand intent from all visible code.

**Fix:** Delete the unused variables.

---

## 11. Deduplicate `BudgetItem` Type ✅

**Effort:** 10 minutes | **Impact:** High (maintainability, AI clarity)

`BudgetItem` is defined identically in three places:

- `lib/parsers/index.ts` (canonical)
- `app/page.tsx` (local copy)
- `components/BudgetChart.tsx` (local copy)

If the schema ever changes, only one of these will get updated. AI assistants
also can't tell which definition is authoritative.

**Fix:** Import from the canonical location (`@/lib/parsers`) in both
`page.tsx` and `BudgetChart.tsx`. If the type outgrows the parsers module
later, promote it to `lib/types.ts`.

---

## 12. Extract `formatAmount` to a Shared Utils Module ✅

**Effort:** 10 minutes | **Impact:** Medium (expandability)

`formatAmount()` is defined locally in `app/page.tsx`. Currency formatting
will be needed on every future page (state budgets, year-over-year, etc.).

**Fix:** Create `lib/utils.ts` (or `lib/format.ts`) and move it there.
Import everywhere it's needed.

**Note:** The extracted function always formats in millions (`$1000.0M` for
$1B). Consider adding adaptive scaling (B/T) before adding more pages.

---

## 13. Make Treasury Importer Date Configurable ✅

**Effort:** 20 minutes | **Impact:** Medium (correctness, expandability)

`lib/importers/treasury.ts` hard-codes `record_date:eq:2024-09-30` in the API
filter. The importer description says "Latest available month" but it always
fetches the same historical snapshot.

**Fix:** Either:
- Accept a date parameter (CLI flag on `sync-budget`, defaulting to latest)
- Query the API for the most recent available reporting period and use that

This is also a prerequisite for multi-year data, which would enable time-series
charts.

---

## 14. Add Static Asset Basics ✅

**Effort:** 15 minutes | **Impact:** Low (polish)

No `public/` directory exists. The site has no favicon, `robots.txt`, or
`sitemap.xml`. For a public-facing site these are expected. Also consider
adding `next/font` (e.g., Inter) for consistent typography.

---

## 15. Add Error Boundaries and a 404 Page ✅

**Effort:** 15 minutes | **Impact:** Low (resilience)

No `error.tsx`, `loading.tsx`, or `not-found.tsx` exist. For a static export
these matter less than a server-rendered app, but:

- `not-found.tsx` improves the 404 experience once multiple routes exist.
- An error boundary around charts prevents one broken visualization from
  crashing the whole page.
- CSV parsing in `page.tsx` happens at module scope with no try/catch — a
  malformed data file crashes the build with an unhelpful error.

**Note:** `ChartErrorBoundary` has a no-op `onReset` callback. The "Try again"
button re-renders the same component with the same props, which will likely hit
the same error. Consider removing the retry button or adding a meaningful reset
action.

---

## 16. Add Tests ✅

**Effort:** 1-2 hours for initial setup, ongoing | **Impact:** High

There are currently zero tests. The parts of the codebase most worth testing
first are the ones that are pure logic with no UI:

1. **CSV parser (`lib/parsers/csv.ts`)** — Unit test `read()` and `write()`
   with known inputs. This is the easiest win: pure functions, no DOM, no
   network. Test edge cases like quoted fields, escaped quotes, empty lines.

2. **Treasury importer `transform()`** — Unit test the transform step with
   fixture API responses. This validates that revenue/spending categorization
   and filtering logic is correct. Mock the `fetch()` call rather than hitting
   the real API.

3. **`formatAmount` and other utils** — Once extracted (item 5), these are
   trivial to unit test.

4. **Component smoke tests** — Verify `BudgetChart` renders without crashing
   given valid props. ECharts can be stubbed since you're testing your code,
   not theirs.

**Recommended stack:** Vitest (fast, native ESM/TS support, good Next.js
compatibility) + React Testing Library for component tests if needed. Jest
works too but Vitest is a better fit for modern Next.js projects.

Avoid testing ECharts configuration details or Tailwind class names — those
are implementation details that change often and provide little safety.

**Note:** Some treasury importer tests access private methods via bracket
notation (`importer["getTargetDate"]()`). This is fragile. Consider testing
these paths through the public `fetch()` API instead.
