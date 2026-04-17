import { Importer, ImporterRegistry, ImporterConfig } from "./types";
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

export function getImporter(name: string, config?: ImporterConfig): Importer {
  const registry: ImporterRegistry = {};
  registry["treasury"] = new TreasuryImporter(config);
  registry["ohio"] = new OhioImporter(config);
  registry["washington"] = new WashingtonImporter(config);
  registry["massachusetts"] = new MassachusettsImporter(config);
  registry["connecticut"] = new ConnecticutImporter(config);
  registry["florida"] = new FloridaImporter(config);
  registry["alabama"] = new AlabamaImporter(config);
  registry["alaska"] = new AlaskaImporter(config);
  registry["arizona"] = new ArizonaImporter(config);
  registry["arkansas"] = new ArkansasImporter(config);
  registry["california"] = new CaliforniaImporter(config);
  registry["colorado"] = new ColoradoImporter(config);
  registry["delaware"] = new DelawareImporter(config);
  registry["georgia"] = new GeorgiaImporter(config);
  registry["hawaii"] = new HawaiiImporter(config);
  registry["idaho"] = new IdahoImporter(config);
  registry["illinois"] = new IllinoisImporter(config);
  registry["indiana"] = new IndianaImporter(config);
  registry["iowa"] = new IowaImporter(config);
  registry["kansas"] = new KansasImporter(config);
  registry["kentucky"] = new KentuckyImporter(config);
  registry["louisiana"] = new LouisianaImporter(config);
  registry["maine"] = new MaineImporter(config);
  registry["maryland"] = new MarylandImporter(config);
  registry["michigan"] = new MichiganImporter(config);
  registry["minnesota"] = new MinnesotaImporter(config);
  registry["mississippi"] = new MississippiImporter(config);
  registry["missouri"] = new MissouriImporter(config);
  registry["montana"] = new MontanaImporter(config);
  registry["nebraska"] = new NebraskaImporter(config);
  registry["nevada"] = new NevadaImporter(config);
  registry["new-hampshire"] = new NewHampshireImporter(config);
  registry["new-jersey"] = new NewJerseyImporter(config);
  registry["new-mexico"] = new NewMexicoImporter(config);
  registry["new-york"] = new NewYorkImporter(config);
  registry["north-carolina"] = new NorthCarolinaImporter(config);
  registry["north-dakota"] = new NorthDakotaImporter(config);
  registry["oklahoma"] = new OklahomaImporter(config);
  registry["oregon"] = new OregonImporter(config);
  registry["pennsylvania"] = new PennsylvaniaImporter(config);
  registry["rhode-island"] = new RhodeIslandImporter(config);
  registry["south-carolina"] = new SouthCarolinaImporter(config);
  registry["south-dakota"] = new SouthDakotaImporter(config);
  registry["tennessee"] = new TennesseeImporter(config);
  registry["texas"] = new TexasImporter(config);
  registry["utah"] = new UtahImporter(config);
  registry["vermont"] = new VermontImporter(config);
  registry["virginia"] = new VirginiaImporter(config);
  registry["west-virginia"] = new WestVirginiaImporter(config);
  registry["wisconsin"] = new WisconsinImporter(config);
  registry["wyoming"] = new WyomingImporter(config);

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
    new AlabamaImporter(),
    new AlaskaImporter(),
    new ArizonaImporter(),
    new ArkansasImporter(),
    new CaliforniaImporter(),
    new ColoradoImporter(),
    new DelawareImporter(),
    new GeorgiaImporter(),
    new HawaiiImporter(),
    new IdahoImporter(),
    new IllinoisImporter(),
    new IndianaImporter(),
    new IowaImporter(),
    new KansasImporter(),
    new KentuckyImporter(),
    new LouisianaImporter(),
    new MaineImporter(),
    new MarylandImporter(),
    new MichiganImporter(),
    new MinnesotaImporter(),
    new MississippiImporter(),
    new MissouriImporter(),
    new MontanaImporter(),
    new NebraskaImporter(),
    new NevadaImporter(),
    new NewHampshireImporter(),
    new NewJerseyImporter(),
    new NewMexicoImporter(),
    new NewYorkImporter(),
    new NorthCarolinaImporter(),
    new NorthDakotaImporter(),
    new OklahomaImporter(),
    new OregonImporter(),
    new PennsylvaniaImporter(),
    new RhodeIslandImporter(),
    new SouthCarolinaImporter(),
    new SouthDakotaImporter(),
    new TennesseeImporter(),
    new TexasImporter(),
    new UtahImporter(),
    new VermontImporter(),
    new VirginiaImporter(),
    new WestVirginiaImporter(),
    new WisconsinImporter(),
    new WyomingImporter(),
  ];
}

export type { ImporterConfig } from "./types";
