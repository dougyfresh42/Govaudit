import * as fs from "fs";
import * as path from "path";
import { getImporter } from "../lib/importers";
import { CsvParser } from "../lib/parsers/csv";

const DATA_DIR = path.join(process.cwd(), "data");
const DEFAULT_OUTPUT = "budget.ts";

interface Args {
  importer?: string;
  output?: string;
  format?: string;
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
  -o, --output <file>    Output file (default: data/budget.csv)
  -f, --format <format>  Output format: csv (default), json
  -h, --help             Show this help message

Examples:
  npx tsx scripts/sync-budget.ts                           # Sync federal budget
  npx tsx scripts/sync-budget.ts -o data/state.csv         # Custom output file
  npx tsx scripts/sync-budget.ts -f json                    # Output as JSON

Available importers:
  - treasury: U.S. Federal Budget (FY2025) by agency
`);
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

  console.log(`Running importer: ${importerName}`);
  console.log(`Output: ${outputFile}`);
  console.log(`Format: ${format}`);

  const importer = getImporter(importerName);
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

  const ext = format === "json" ? "json" : format === "ts" ? "ts" : "csv";
  const outputPath = path.join(DATA_DIR, `${outputFileName}.${ext}`);
  fs.writeFileSync(outputPath, output);

  console.log(`\nWrote ${budgetItems.length} items to ${outputPath}`);

  const totalIncome = budgetItems.filter((i) => i.type === "income").reduce((sum, i) => sum + i.amount, 0);
  const totalSpending = budgetItems.filter((i) => i.type === "spending").reduce((sum, i) => sum + i.amount, 0);

  console.log(`Total Income: $${(totalIncome / 1e9).toFixed(2)}B`);
  console.log(`Total Spending: $${(totalSpending / 1e9).toFixed(2)}B`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
