import { Importer, ImporterRegistry, ImporterConfig } from "./types";
import { TreasuryImporter } from "./treasury";

export function getImporter(name: string, config?: ImporterConfig): Importer {
  const registry: ImporterRegistry = {};
  registry.treasury = new TreasuryImporter(config);

  const importer = registry[name];
  if (!importer) {
    throw new Error(`Unknown importer: ${name}. Available: ${Object.keys(registry).join(", ")}`);
  }
  return importer;
}

export function listImporters(): Importer[] {
  return [new TreasuryImporter()];
}

export type { ImporterConfig } from "./types";
