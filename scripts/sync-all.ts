/**
 * sync-all.ts — Bulk importer orchestrator.
 *
 * Reads sync.config.json to determine the date range and importers to run.
 * For each (importer, month) pair it checks whether a cached snapshot already
 * exists under data/snapshots/{datasetId}/{YYYY-MM}.json before hitting any
 * remote API, so re-running the script (e.g. in CI) is cheap.
 *
 * After all imports are complete it rebuilds data/snapshots.json from the
 * individual cached files so the Next.js app always reads a single flat array.
 *
 * Usage:
 *   npx tsx scripts/sync-all.ts
 */
import * as fs from "fs";
import * as path from "path";
import { getImporter } from "../lib/importers";
import { CsvParser } from "../lib/parsers/csv";
import type { BudgetSnapshot } from "../lib/importers/types";

const DATA_DIR = path.join(process.cwd(), "data");
const SNAPSHOTS_DIR = path.join(DATA_DIR, "snapshots");
const SNAPSHOTS_JSON = path.join(DATA_DIR, "snapshots.json");
const SYNC_CONFIG = path.join(process.cwd(), "sync.config.json");

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

interface SyncConfig {
  startDate: string;
  importers: string[];
}

function loadConfig(): SyncConfig {
  if (!fs.existsSync(SYNC_CONFIG)) {
    throw new Error(`sync.config.json not found at ${SYNC_CONFIG}`);
  }
  const raw = fs.readFileSync(SYNC_CONFIG, "utf-8");
  return JSON.parse(raw) as SyncConfig;
}

// ---------------------------------------------------------------------------
// Individual snapshot file helpers
// ---------------------------------------------------------------------------

function snapshotFilePath(datasetId: string, snapshotKey: string): string {
  return path.join(SNAPSHOTS_DIR, datasetId, `${snapshotKey}.json`);
}

function snapshotExists(datasetId: string, snapshotKey: string): boolean {
  return fs.existsSync(snapshotFilePath(datasetId, snapshotKey));
}

function writeSnapshot(snapshot: BudgetSnapshot): void {
  const { datasetId, snapshotKey } = snapshot.meta;
  const dir = path.join(SNAPSHOTS_DIR, datasetId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    snapshotFilePath(datasetId, snapshotKey),
    JSON.stringify(snapshot, null, 2) + "\n"
  );
}

// ---------------------------------------------------------------------------
// Consolidated snapshots.json rebuild
// ---------------------------------------------------------------------------

function loadAllSnapshots(): BudgetSnapshot[] {
  if (!fs.existsSync(SNAPSHOTS_DIR)) return [];
  const snapshots: BudgetSnapshot[] = [];
  for (const entry of fs.readdirSync(SNAPSHOTS_DIR)) {
    const datasetDir = path.join(SNAPSHOTS_DIR, entry);
    if (!fs.statSync(datasetDir).isDirectory()) continue;
    for (const file of fs.readdirSync(datasetDir)) {
      if (!file.endsWith(".json")) continue;
      const raw = fs.readFileSync(path.join(datasetDir, file), "utf-8");
      snapshots.push(JSON.parse(raw) as BudgetSnapshot);
    }
  }
  // Sort newest-first by snapshotKey; break ties by datasetId for stability
  return snapshots.sort((a, b) => {
    const keyDiff = b.meta.snapshotKey.localeCompare(a.meta.snapshotKey);
    return keyDiff !== 0 ? keyDiff : a.meta.datasetId.localeCompare(b.meta.datasetId);
  });
}

function rebuildSnapshotsJson(): void {
  const snapshots = loadAllSnapshots();
  fs.writeFileSync(SNAPSHOTS_JSON, JSON.stringify(snapshots, null, 2) + "\n");
  console.log(`\nRebuilt data/snapshots.json with ${snapshots.length} total snapshots.`);
}

// ---------------------------------------------------------------------------
// Migration — move entries from the flat snapshots.json into individual files
// ---------------------------------------------------------------------------

function migrateExistingSnapshots(): void {
  if (!fs.existsSync(SNAPSHOTS_JSON)) return;
  const raw = fs.readFileSync(SNAPSHOTS_JSON, "utf-8");
  const existing = JSON.parse(raw) as BudgetSnapshot[];
  let migrated = 0;
  for (const snapshot of existing) {
    const { datasetId, snapshotKey } = snapshot.meta;
    if (datasetId && snapshotKey && !snapshotExists(datasetId, snapshotKey)) {
      writeSnapshot(snapshot);
      migrated++;
    }
  }
  if (migrated > 0) {
    console.log(`Migrated ${migrated} existing snapshot(s) to individual files.`);
  }
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/** Return the last calendar day of a given month as YYYY-MM-DD. */
function endOfMonth(year: number, month: number): string {
  // Passing day=0 of the *next* month gives the last day of the current month.
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}

interface MonthSlot {
  snapshotKey: string; // YYYY-MM
  endDate: string; // YYYY-MM-DD (last day of the month)
}

/**
 * Enumerate every calendar month from startDate up to and including the
 * current month (UTC).
 */
function generateMonthRange(startDate: string): MonthSlot[] {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  const now = new Date();
  const endYear = now.getUTCFullYear();
  const endMonth = now.getUTCMonth() + 1; // 1-indexed

  const months: MonthSlot[] = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const snapshotKey = `${year}-${String(month).padStart(2, "0")}`;
    months.push({ snapshotKey, endDate: endOfMonth(year, month) });
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return months;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const config = loadConfig();
  console.log(`sync.config.json loaded.`);
  console.log(`  startDate : ${config.startDate}`);
  console.log(`  importers : ${config.importers.join(", ")}`);

  // Ensure data dirs exist
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });

  // Move any hand-crafted entries in the flat file into individual cache files
  migrateExistingSnapshots();

  const months = generateMonthRange(config.startDate);
  console.log(
    `\nMonth range: ${months[0].snapshotKey} → ${months[months.length - 1].snapshotKey} (${months.length} month(s))`
  );

  const parser = new CsvParser();
  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const importerName of config.importers) {
    console.log(`\n── ${importerName} ──`);
    for (const { snapshotKey, endDate } of months) {
      if (snapshotExists(importerName, snapshotKey)) {
        skipped++;
        continue;
      }

      process.stdout.write(`  ${snapshotKey} (${endDate}) … `);
      try {
        const importer = getImporter(importerName, { date: endDate });
        const rawData = await importer.fetch();
        const budgetItems = importer.transform(rawData);

        if (!importer.getMetadata) {
          console.log("skipped (no getMetadata)");
          continue;
        }

        const importedAt = new Date().toISOString();
        const imp = importer as unknown as { getResolvedDate?(): string | null };
        const resolvedDate = imp.getResolvedDate?.() ?? endDate;

        const meta = importer.getMetadata(resolvedDate, importedAt);
        const csv = parser.write(budgetItems);
        const snapshot: BudgetSnapshot = { meta, csv };

        if (budgetItems.length === 0) {
          // Don't cache empty results — the importer may not support this
          // period yet; let the next run retry.
          console.log("skipped (no data returned)");
          continue;
        }

        writeSnapshot(snapshot);
        imported++;
        console.log(`saved (${budgetItems.length} items)`);
      } catch (err) {
        failed++;
        console.log(`FAILED — ${(err as Error).message}`);
      }
    }
  }

  console.log(
    `\nImport summary: ${imported} new, ${skipped} cached, ${failed} failed.`
  );

  rebuildSnapshotsJson();
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
