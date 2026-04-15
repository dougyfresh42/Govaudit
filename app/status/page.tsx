import snapshots from "@/data/budget";
import { DATASET_REGISTRY } from "@/lib/importers/registry";
import ImporterStatusPanel from "@/components/ImporterStatusPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Importer Status — Government Audit",
  description: "Status of all data importers: which datasets have been imported, their data quality, and available date ranges.",
};

export default function StatusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Importer Status</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Overview of all registered data importers — shows which datasets have been pulled, their
          data quality ({" "}
          <span className="font-medium text-green-700 dark:text-green-400">live</span> vs.{" "}
          <span className="font-medium text-amber-700 dark:text-amber-400">placeholder</span>
          ), and the available reporting periods.
        </p>
      </div>

      <ImporterStatusPanel registry={DATASET_REGISTRY} snapshots={snapshots} />
    </div>
  );
}
