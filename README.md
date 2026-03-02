# Government Audit - Budget Visualization

A data visualization website for exploring government budget data using Next.js, React, and ECharts.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (static export)
npm run build
```

The site will be available at `http://localhost:3000` (dev) or in the `out/` folder (production).

## Syncing Budget Data

Run the importer to fetch the latest federal budget data from the U.S. Treasury:

```bash
# Install tsx for running TypeScript scripts (if not already installed)
npm install -D tsx

# Sync federal budget data
npm run sync-budget
```

The importer fetches data from the [U.S. Treasury Fiscal Data API](https://fiscaldata.treasury.gov/) and writes to `data/budget.ts`.

### Options

```bash
# Output as CSV instead
npm run sync-budget -- -f csv

# Output as JSON
npm run sync-budget -- -f json

# Custom output file
npm run sync-budget -- -o data/custom.ts
```

### Adding New Importers

Importers live in `lib/importers/`. Each importer implements:

```typescript
interface Importer {
  name: string;
  description: string;
  fetch(): Promise<RawData>;
  transform(data: RawData): BudgetItem[];
}
```

Add new importers to the registry in `lib/importers/index.ts` to make them available via CLI.

## Open Questions

### Data Format

Currently data is stored as a CSV string in a TypeScript module (`data/budget.ts`). This works but has tradeoffs:
- AI assistants expect JSON and write incorrect import code
- Harder to add nested structures
- Non-standard for TS projects

Consider switching to `data/budget.json` for easier development. See [REVIEW.md](./REVIEW.md) item 6 for details.
