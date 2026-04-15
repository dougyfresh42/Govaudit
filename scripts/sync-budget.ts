import * as fs from "fs";
import * as path from "path";
import { getImporter } from "../lib/importers";
import { CsvParser } from "../lib/parsers/csv";
import type { BudgetSnapshot } from "../lib/importers/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DEFAULT_OUTPUT = "budget.ts";
const SNAPSHOTS_FILE = path.join(DATA_DIR, "snapshots.json");

interface Args {
  importer?: string;
  output?: string;
  format?: string;
  date?: string;
  help?: boolean;
}

function parseArgs(): Args {
  const args: Args = {};
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "-i":
      case "--importer":
        args.importer = argv[++i];
        break;
      case "-o":
      case "--output":
        args.output = argv[++i];
        break;
      case "-f":
      case "--format":
        args.format = argv[++i];
        break;
      case "-d":
      case "--date":
        args.date = argv[++i];
        break;
      case "-h":
      case "--help":
        args.help = true;
        break;
    }
  }
  return args;
}

function printHelp() {
  console.log(`
Budget Data Sync Tool

Usage: npx tsx scripts/sync-budget.ts [options]

Options:
  -i, --importer <name>   Importer to use (default: treasury)
  -o, --output <file>    Output file (default: data/budget.ts)
  -f, --format <format>  Output format: ts (default), csv, json
  -d, --date <date>      Record date: YYYY-MM-DD or 'latest' (default: latest)
  -h, --help             Show this help message

Examples:
  npx tsx scripts/sync-budget.ts                           # Sync federal budget (latest)
  npx tsx scripts/sync-budget.ts -d 2024-12-31             # Sync specific date
  npx tsx scripts/sync-budget.ts -o data/state.csv         # Custom output file
  npx tsx scripts/sync-budget.ts -f json                    # Output as JSON

Available importers:
  - treasury: U.S. Federal Budget (FY2025) by agency
`);
}

/** Load existing snapshots from snapshots.json; returns [] if the file does not exist. */
function loadSnapshots(): BudgetSnapshot[] {
  if (!fs.existsSync(SNAPSHOTS_FILE)) return [];
  const raw = fs.readFileSync(SNAPSHOTS_FILE, "utf-8");
  return JSON.parse(raw) as BudgetSnapshot[];
}

/** Persist the snapshot array to snapshots.json. */
function saveSnapshots(snapshots: BudgetSnapshot[]): void {
  fs.writeFileSync(SNAPSHOTS_FILE, JSON.stringify(snapshots, null, 2) + "\n");
}

async function main() {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    return;
  }

  const importerName = args.importer || "treasury";
  const outputFile = args.output || DEFAULT_OUTPUT;
  const format = args.format || "ts";
  const date = args.date || "latest";

  console.log(`Running importer: ${importerName}`);
  console.log(`Output: ${outputFile}`);
  console.log(`Format: ${format}`);
  console.log(`Date: ${date}`);

  const importer = getImporter(importerName, { date });
  console.log(`Description: ${importer.description}`);

  console.log("Fetching data...");
  const rawData = await importer.fetch();

  console.log("Transforming data...");
  const budgetItems = importer.transform(rawData);

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const parser = new CsvParser();
  let output: string;
  const outputFileName = outputFile.replace(/^data\//, "").replace(/\.[^.]+$/, "");

  if (format === "json") {
    output = JSON.stringify(budgetItems, null, 2);
  } else if (format === "ts") {
    const csvContent = parser.write(budgetItems);
    output = `const csv = \`${csvContent.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`;\n\nexport default csv;`;
  } else {
    output = parser.write(budgetItems);
  }

  // ------------------------------------------------------------------
  // Append-only snapshot logic (always runs for the default ts format)
  // ------------------------------------------------------------------
  if (format === "ts" && importer.getMetadata) {
    const importedAt = new Date().toISOString();

    // Resolve the data date that was actually fetched
    const resolvedDate: string = (() => {
      // TreasuryImporter exposes getResolvedDate(); fall back to today if missing
      const imp = importer as unknown as { getResolvedDate?(): string | null };
      return imp.getResolvedDate?.() ?? new Date().toISOString().slice(0, 10);
    })();

    const meta = importer.getMetadata(resolvedDate, importedAt);
    const csvContent = parser.write(budgetItems);
    const newSnapshot: BudgetSnapshot = { meta, csv: csvContent };

    const existing = loadSnapshots();
    const isDuplicate = existing.some((s) => s.meta.snapshotKey === meta.snapshotKey);

    if (isDuplicate) {
      console.log(`\nSnapshot ${meta.snapshotKey} already exists — skipping append.`);
    } else {
      // Prepend so the newest snapshot is always first
      const updated = [newSnapshot, ...existing];
      saveSnapshots(updated);
      console.log(`\nAppended snapshot ${meta.snapshotKey} to ${SNAPSHOTS_FILE}`);
      console.log(`Total snapshots stored: ${updated.length}`);
    }
  }

  // ------------------------------------------------------------------
  // Legacy / non-ts output (csv, json, or custom paths)
  // ------------------------------------------------------------------
  if (format !== "ts" || (args.output && args.output !== DEFAULT_OUTPUT)) {
    const ext = format === "json" ? "json" : format === "ts" ? "ts" : "csv";
    const outputPath = path.join(DATA_DIR, `${outputFileName}.${ext}`);
    fs.writeFileSync(outputPath, output);
    console.log(`\nWrote ${budgetItems.length} items to ${outputPath}`);
  }

  const totalIncome = budgetItems.filter((i) => i.type === "income").reduce((sum, i) => sum + i.amount, 0);
  const totalSpending = budgetItems.filter((i) => i.type === "spending").reduce((sum, i) => sum + i.amount, 0);

  console.log(`Total Income: $${(totalIncome / 1e9).toFixed(2)}B`);
  console.log(`Total Spending: $${(totalSpending / 1e9).toFixed(2)}B`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
