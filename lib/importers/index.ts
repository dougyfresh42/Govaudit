import { Importer, ImporterRegistry } from "./types";
import { TreasuryImporter } from "./treasury";

export function getImporter(name: string): Importer {
  const registry: ImporterRegistry = {
    treasury: new TreasuryImporter(),
  };

  const importer = registry[name];
  if (!importer) {
    throw new Error(`Unknown importer: ${name}. Available: ${Object.keys(registry).join(", ")}`);
  }
  return importer;
}

export function listImporters(): Importer[] {
  return [new TreasuryImporter()];
}
