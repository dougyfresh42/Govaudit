# Government Audit - Middle-earth Budget Visualization

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

## Tech Stack

- **Next.js 14** - React framework with static export
- **React 18** - UI library
- **ECharts** - Visualization library (via echarts-for-react)
- **Tailwind CSS** - Styling

## Data

Data is stored in `data/budget.json`. Edit the JSON and refresh to update visualizations.

## Future Enhancements

- **Zustand** - For live filtering capabilities
- **DuckDB** - For handling larger datasets

## Adding New Visualizations

See [AGENTS.md](./AGENTS.md) for detailed documentation on how to add charts and data.
