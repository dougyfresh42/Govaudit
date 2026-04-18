import type { Importer, ImporterConfig } from "./types";
import { TreasuryImporter } from "./treasury";
import { OhioImporter } from "./ohio";
import { WashingtonImporter } from "./washington";
import { MassachusettsImporter } from "./massachusetts";
import { ConnecticutImporter } from "./connecticut";
import { FloridaImporter } from "./florida";
import { AlabamaImporter } from "./alabama";
import { AlaskaImporter } from "./alaska";
import { ArizonaImporter } from "./arizona";
import { ArkansasImporter } from "./arkansas";
import { CaliforniaImporter } from "./california";
import { ColoradoImporter } from "./colorado";
import { DelawareImporter } from "./delaware";
import { GeorgiaImporter } from "./georgia";
import { HawaiiImporter } from "./hawaii";
import { IdahoImporter } from "./idaho";
import { IllinoisImporter } from "./illinois";
import { IndianaImporter } from "./indiana";
import { IowaImporter } from "./iowa";
import { KansasImporter } from "./kansas";
import { KentuckyImporter } from "./kentucky";
import { LouisianaImporter } from "./louisiana";
import { MaineImporter } from "./maine";
import { MarylandImporter } from "./maryland";
import { MichiganImporter } from "./michigan";
import { MinnesotaImporter } from "./minnesota";
import { MississippiImporter } from "./mississippi";
import { MissouriImporter } from "./missouri";
import { MontanaImporter } from "./montana";
import { NebraskaImporter } from "./nebraska";
import { NevadaImporter } from "./nevada";
import { NewHampshireImporter } from "./new-hampshire";
import { NewJerseyImporter } from "./new-jersey";
import { NewMexicoImporter } from "./new-mexico";
import { NewYorkImporter } from "./new-york";
import { NorthCarolinaImporter } from "./north-carolina";
import { NorthDakotaImporter } from "./north-dakota";
import { OklahomaImporter } from "./oklahoma";
import { OregonImporter } from "./oregon";
import { PennsylvaniaImporter } from "./pennsylvania";
import { RhodeIslandImporter } from "./rhode-island";
import { SouthCarolinaImporter } from "./south-carolina";
import { SouthDakotaImporter } from "./south-dakota";
import { TennesseeImporter } from "./tennessee";
import { TexasImporter } from "./texas";
import { UtahImporter } from "./utah";
import { VermontImporter } from "./vermont";
import { VirginiaImporter } from "./virginia";
import { WestVirginiaImporter } from "./west-virginia";
import { WisconsinImporter } from "./wisconsin";
import { WyomingImporter } from "./wyoming";

/**
 * Factory constructors keyed by importer id. Each entry takes an optional
 * ImporterConfig and returns a ready-to-use Importer instance.
 */
type ImporterFactory = (_config?: ImporterConfig) => Importer;

const IMPORTER_FACTORIES: Record<string, ImporterFactory> = {
  treasury:          (c) => new TreasuryImporter(c),
  ohio:              (c) => new OhioImporter(c),
  washington:        (c) => new WashingtonImporter(c),
  massachusetts:     (c) => new MassachusettsImporter(c),
  connecticut:       (c) => new ConnecticutImporter(c),
  florida:           (c) => new FloridaImporter(c),
  alabama:           (c) => new AlabamaImporter(c),
  alaska:            (c) => new AlaskaImporter(c),
  arizona:           (c) => new ArizonaImporter(c),
  arkansas:          (c) => new ArkansasImporter(c),
  california:        (c) => new CaliforniaImporter(c),
  colorado:          (c) => new ColoradoImporter(c),
  delaware:          (c) => new DelawareImporter(c),
  georgia:           (c) => new GeorgiaImporter(c),
  hawaii:            (c) => new HawaiiImporter(c),
  idaho:             (c) => new IdahoImporter(c),
  illinois:          (c) => new IllinoisImporter(c),
  indiana:           (c) => new IndianaImporter(c),
  iowa:              (c) => new IowaImporter(c),
  kansas:            (c) => new KansasImporter(c),
  kentucky:          (c) => new KentuckyImporter(c),
  louisiana:         (c) => new LouisianaImporter(c),
  maine:             (c) => new MaineImporter(c),
  maryland:          (c) => new MarylandImporter(c),
  michigan:          (c) => new MichiganImporter(c),
  minnesota:         (c) => new MinnesotaImporter(c),
  mississippi:       (c) => new MississippiImporter(c),
  missouri:          (c) => new MissouriImporter(c),
  montana:           (c) => new MontanaImporter(c),
  nebraska:          (c) => new NebraskaImporter(c),
  nevada:            (c) => new NevadaImporter(c),
  "new-hampshire":   (c) => new NewHampshireImporter(c),
  "new-jersey":      (c) => new NewJerseyImporter(c),
  "new-mexico":      (c) => new NewMexicoImporter(c),
  "new-york":        (c) => new NewYorkImporter(c),
  "north-carolina":  (c) => new NorthCarolinaImporter(c),
  "north-dakota":    (c) => new NorthDakotaImporter(c),
  oklahoma:          (c) => new OklahomaImporter(c),
  oregon:            (c) => new OregonImporter(c),
  pennsylvania:      (c) => new PennsylvaniaImporter(c),
  "rhode-island":    (c) => new RhodeIslandImporter(c),
  "south-carolina":  (c) => new SouthCarolinaImporter(c),
  "south-dakota":    (c) => new SouthDakotaImporter(c),
  tennessee:         (c) => new TennesseeImporter(c),
  texas:             (c) => new TexasImporter(c),
  utah:              (c) => new UtahImporter(c),
  vermont:           (c) => new VermontImporter(c),
  virginia:          (c) => new VirginiaImporter(c),
  "west-virginia":   (c) => new WestVirginiaImporter(c),
  wisconsin:         (c) => new WisconsinImporter(c),
  wyoming:           (c) => new WyomingImporter(c),
};

export function getImporter(name: string, config?: ImporterConfig): Importer {
  const factory = IMPORTER_FACTORIES[name];
  if (!factory) {
    throw new Error(
      `Unknown importer: ${name}. Available: ${Object.keys(IMPORTER_FACTORIES).join(", ")}`
    );
  }
  return factory(config);
}

export function listImporters(): Importer[] {
  return Object.values(IMPORTER_FACTORIES).map((factory) => factory());
}

export type { ImporterConfig } from "./types";
