import { Importer, ImporterRegistry, ImporterConfig } from "./types";
import { TreasuryImporter } from "./treasury";
import { OhioImporter } from "./ohio";
import { WashingtonImporter } from "./washington";
import { MassachusettsImporter } from "./massachusetts";
import { ConnecticutImporter } from "./connecticut";
import { FloridaImporter } from "./florida";

export function getImporter(name: string, config?: ImporterConfig): Importer {
  const registry: ImporterRegistry = {};
  registry.treasury = new TreasuryImporter(config);
  registry.ohio = new OhioImporter(config);
  registry.washington = new WashingtonImporter(config);
  registry.massachusetts = new MassachusettsImporter(config);
  registry.connecticut = new ConnecticutImporter(config);
  registry.florida = new FloridaImporter(config);

  const importer = registry[name];
  if (!importer) {
    throw new Error(`Unknown importer: ${name}. Available: ${Object.keys(registry).join(", ")}`);
  }
  return importer;
}

export function listImporters(): Importer[] {
  return [
    new TreasuryImporter(),
    new OhioImporter(),
    new WashingtonImporter(),
    new MassachusettsImporter(),
    new ConnecticutImporter(),
    new FloridaImporter(),
  ];
}

export type { ImporterConfig } from "./types";
