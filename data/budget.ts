import type { BudgetSnapshot } from "@/lib/importers/types";
import snapshotsData from "./snapshots.json";

// Snapshots are stored newest-first; the first entry is always the current snapshot.
const snapshots: BudgetSnapshot[] = snapshotsData as BudgetSnapshot[];

export default snapshots;