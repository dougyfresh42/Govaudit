# AGENTS.md - Guidance for AI Assistants

This project uses Next.js 15 with React and ECharts to build a data visualization website.
**Maintainers: Keep this file accurate. Update it whenever the stack, data format, or architecture changes.**

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow requirements.
AGENTS.md specifies generically some development strategies relevant to LLMs in this repository.

### AGENTS.md will:
- list documentation locations
- specify preferred frameworks and data locations

### AGENTS.md will not:
- repeat documentation
- specify patterns that are findable by reading the code
- contain file trees which will quickly become outdated
- repeat human instructions which can be found in the README.md

## Key Documentation

- **Next.js Docs**: https://nextjs.org/docs
- **ECharts Docs**: https://echarts.apache.org/en/api.html
- **echarts-for-react**: https://github.com/hustcc/echarts-for-react
- **Tailwind CSS**: https://tailwindcss.com/docs

## Data Location

Data files are stored in `data/budget.ts` (a TypeScript module exporting a CSV string). Add new datasets there and import them in components.
