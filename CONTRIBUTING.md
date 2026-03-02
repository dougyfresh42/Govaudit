# Contributing

## Development Workflow

1. **Lint must pass** before committing:
   ```bash
   npm run lint
   ```

2. **Build must pass** before committing:
   ```bash
   npm run build
   ```

3. **Tests should pass** (when implemented):
   ```bash
   npm run test
   ```

4. **Aim for high test coverage** on pure logic (utils, parsers, importers). Component tests are optional unless there's significant UI logic worth verifying.

## Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Prefix unused function parameters with `_` (e.g., `function foo(_arg: string)`)
- Use ESLint and TypeScript compiler settings to catch issues early
- Check for unused CSS custom properties in `globals.css` before committing

## Adding New Features

- Place reusable logic in `lib/`
- Place UI components in `components/`
- Place data files in `data/`
- Update `AGENTS.md` if the stack or data format changes
