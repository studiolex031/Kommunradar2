export interface Municipality {
  id: string;
  name: string;
  region: string;
  x: number;
  y: number;
  population: number;
}

export interface Tender {
  id: string;
  title: string;
  municipalityId: string;
  category: string;
  value: number;
  deadline: string;
  posted: string;
  status: "open" | "closing-soon" | "closed";
  description: string;
  summary: string;
  keywords: string[];
  priority: number;
  sourceUrl?: string;
  buyer?: string;
  source?: "catalog" | "ted";
}

export interface AnalyticsData {
  totalTenders: number;
  totalValue: number;
  openTenders: number;
  avgValue: number;
  monthlyTrends: Array<{ month: string; count: number; value: number }>;
  categoryBreakdown: Array<{ category: string; count: number; value: number }>;
  regionBreakdown: Array<{ region: string; count: number; value: number }>;
}

const project = (lat: number, lon: number) => ({
  x: ((lon - 10.8) / 13.4) * 70 + 16,
  y: ((69.1 - lat) / 14.1) * 78 + 6,
});

export const municipalities: Municipality[] = [
  { id: "kiruna", name: "Kiruna", region: "Norrbotten", population: 22415, ...project(67.86, 20.23) },
  { id: "lulea", name: "Luleå", region: "Norrbotten", population: 79300, ...project(65.58, 22.15) },
  { id: "pitea", name: "Piteå", region: "Norrbotten", population: 42100, ...project(65.32, 21.49) },
  { id: "skelleftea", name: "Skellefteå", region: "Västerbotten", population: 73600, ...project(64.75, 20.95) },
  { id: "umea", name: "Umeå", region: "Västerbotten", population: 130224, ...project(63.83, 20.26) },
  { id: "ostersund", name: "Östersund", region: "Jämtland", population: 64700, ...project(63.18, 14.64) },
  { id: "harjedalen", name: "Härjedalen", region: "Jämtland", population: 10200, ...project(62.05, 14.35) },
  { id: "sundsvall", name: "Sundsvall", region: "Västernorrland", population: 99400, ...project(62.39, 17.31) },
  { id: "ang", name: "Ånge", region: "Västernorrland", population: 9200, ...project(62.52, 15.66) },
  { id: "gavle", name: "Gävle", region: "Gävleborg", population: 103000, ...project(60.67, 17.14) },
  { id: "falun", name: "Falun", region: "Dalarna", population: 59900, ...project(60.61, 15.63) },
  { id: "karlstad", name: "Karlstad", region: "Värmland", population: 96100, ...project(59.38, 13.50) },
  { id: "orebro", name: "Örebro", region: "Örebro", population: 158000, ...project(59.27, 15.21) },
  { id: "lindesberg", name: "Lindesberg", region: "Örebro", population: 23600, ...project(59.59, 15.23) },
  { id: "kumla", name: "Kumla", region: "Örebro", population: 22000, ...project(59.13, 15.14) },
  { id: "vasteras", name: "Västerås", region: "Västmanland", population: 158000, ...project(59.61, 16.54) },
  { id: "fagersta", name: "Fagersta", region: "Västmanland", population: 13200, ...project(60.00, 15.79) },
  { id: "uppsala", name: "Uppsala", region: "Uppsala", population: 237000, ...project(59.86, 17.64) },
  { id: "stockholm", name: "Stockholm", region: "Stockholm", population: 984870, ...project(59.33, 18.07) },
  { id: "solna", name: "Solna", region: "Stockholm", population: 85000, ...project(59.36, 18.00) },
  { id: "huddinge", name: "Huddinge", region: "Stockholm", population: 114000, ...project(59.24, 17.98) },
  { id: "sodertalje", name: "Södertälje", region: "Stockholm", population: 102000, ...project(59.20, 17.63) },
  { id: "taby", name: "Täby", region: "Stockholm", population: 75000, ...project(59.44, 18.07) },
  { id: "sigtuna", name: "Sigtuna", region: "Stockholm", population: 52000, ...project(59.62, 17.72) },
  { id: "nykoping", name: "Nyköping", region: "Södermanland", population: 58000, ...project(58.75, 17.01) },
  { id: "eskilstuna", name: "Eskilstuna", region: "Södermanland", population: 107000, ...project(59.37, 16.51) },
  { id: "linkoping", name: "Linköping", region: "Östergötland", population: 165000, ...project(58.41, 15.62) },
  { id: "norrkoping", name: "Norrköping", region: "Östergötland", population: 144000, ...project(58.59, 16.19) },
  { id: "jonkoping", name: "Jönköping", region: "Jönköpings län", population: 145000, ...project(57.78, 14.16) },
  { id: "vaxjo", name: "Växjö", region: "Kronoberg", population: 97000, ...project(56.88, 14.81) },
  { id: "kalmar", name: "Kalmar", region: "Kalmar län", population: 72000, ...project(56.66, 16.36) },
  { id: "visby", name: "Visby", region: "Gotland", population: 26000, ...project(57.63, 18.29) },
  { id: "gothenburg", name: "Göteborg", region: "Västra Götaland", population: 587549, ...project(57.71, 11.97) },
  { id: "boras", name: "Borås", region: "Västra Götaland", population: 114000, ...project(57.72, 12.94) },
  { id: "trollhattan", name: "Trollhättan", region: "Västra Götaland", population: 59000, ...project(58.28, 12.29) },
  { id: "mariestad", name: "Mariestad", region: "Västra Götaland", population: 24600, ...project(58.71, 13.82) },
  { id: "halmstad", name: "Halmstad", region: "Halland", population: 104000, ...project(56.67, 12.86) },
  { id: "helsingborg", name: "Helsingborg", region: "Skåne", population: 150000, ...project(56.05, 12.69) },
  { id: "lund", name: "Lund", region: "Skåne", population: 128000, ...project(55.70, 13.19) },
  { id: "malmo", name: "Malmö", region: "Skåne", population: 351749, ...project(55.61, 13.00) },
  { id: "kristianstad", name: "Kristianstad", region: "Skåne", population: 86000, ...project(56.03, 14.15) },
];

const rawTenders: Omit<Tender, "status">[] = [
  {
    id: "t1",
    title: "Digital plattform för kommunal tjänsteförmedling",
    municipalityId: "stockholm",
    category: "IT & Digitalisering",
    value: 48500000,
    deadline: "2026-11-15",
    posted: "2026-09-02",
    description:
      "Stockholms stad söker en partner för att utveckla en modern digital plattform som förenklar tjänsteförmedlingen mellan kommunen och dess medborgare. Plattformen ska omfatta e-tjänster, personlig profil och automatiserad ärendehantering enligt WCAG 2.2 AA.",
    summary:
      "Bygg en modern medborgarplattform med e-tjänster, profil och automatiserad ärendehantering. Anbud senast 15 november.",
    keywords: ["digitalisering", "e-tjänster", "plattform", "ärendehantering"],
    priority: 9,
    sourceUrl: "https://www.stockholm.se/naringsliv/upphandling/",
    buyer: "Stockholms stad",
  },
  {
    id: "t2",
    title: "Energieffektivisering av skolbyggnader",
    municipalityId: "gothenburg",
    category: "Bygg & Fastighet",
    value: 32000000,
    deadline: "2026-11-28",
    posted: "2026-09-05",
    description:
      "Göteborgs Stad vill energieffektivisera 12 skolbyggnader genom isolering, ventilation och solceller. Uppdraget omfattar projektering, installation och uppföljning.",
    summary: "Energieffektivisering av tolv skolbyggnader med isolering, ventilation och solceller.",
    keywords: ["energi", "skolor", "solceller", "ventilation"],
    priority: 8,
    sourceUrl: "https://goteborg.se/wps/portal/start/foretag/upphandling",
    buyer: "Göteborgs Stad",
  },
  {
    id: "t3",
    title: "AI-baserad trafikanalys",
    municipalityId: "malmo",
    category: "IT & Digitalisering",
    value: 27500000,
    deadline: "2026-12-01",
    posted: "2026-09-08",
    description:
      "Malmö stad söker leverantör för AI-baserad trafikanalys som ska förbättra trafikflöden i centrum. Lösningen ska analysera sensordata och ge prediktiva rekommendationer.",
    summary: "AI-lösning för trafikdata från stadens sensorer med prediktiva rekommendationer.",
    keywords: ["AI", "trafik", "sensorer", "dataanalys"],
    priority: 9,
    sourceUrl: "https://malmo.se/foretagande/upphandling.html",
    buyer: "Malmö stad",
  },
  {
    id: "t4",
    title: "Bulleravskärmning längs E4",
    municipalityId: "linkoping",
    category: "Bygg & Fastighet",
    value: 18900000,
    deadline: "2026-10-28",
    posted: "2026-09-10",
    description:
      "Linköpings kommun behöver bulleravskärmning längs 4 kilometer av E4 genom tätorten. Uppdraget omfattar projektering, produktion och montering.",
    summary: "Modulära bullerskydd längs 4 kilometer av E4 genom Linköping.",
    keywords: ["trafik", "buller", "avskärmning", "modular"],
    priority: 7,
    sourceUrl: "https://www.linkoping.se/naringsliv-och-arbete/upphandling/",
    buyer: "Linköpings kommun",
  },
  {
    id: "t5",
    title: "Kommunalt CRM-system",
    municipalityId: "uppsala",
    category: "IT & Digitalisering",
    value: 22000000,
    deadline: "2027-01-15",
    posted: "2026-09-12",
    description:
      "Uppsala kommun söker partner för att införa ett modernt CRM för alla nämnder med integration av ärenden, kommunikation och dokumenthantering.",
    summary: "CRM för hela kommunen med ärenden, kommunikation och GDPR-krav.",
    keywords: ["CRM", "nämnder", "GDPR", "integration"],
    priority: 8,
    sourceUrl: "https://www.uppsala.se/foretag-och-arbete/upphandling/",
    buyer: "Uppsala kommun",
  },
  {
    id: "t6",
    title: "Renovering av idrottshall",
    municipalityId: "vasteras",
    category: "Bygg & Fastighet",
    value: 41000000,
    deadline: "2027-02-28",
    posted: "2026-09-15",
    description:
      "Västerås stad vill renovera kommunens stora idrottshall med nya läktare, ytskikt och tekniska installationer.",
    summary: "Totalrenovering av idrottshall inklusive läktare och teknik.",
    keywords: ["idrott", "renovering", "läktare", "projekt"],
    priority: 8,
    buyer: "Västerås stad",
  },
  {
    id: "t7",
    title: "Cykelvägnät och gångmiljöer",
    municipalityId: "orebro",
    category: "Mark & Miljö",
    value: 29500000,
    deadline: "2026-11-18",
    posted: "2026-09-18",
    description:
      "Örebro kommun söker leverantör för utbyggnad av cykelvägnät och förbättrade gångmiljöer i tillväxtområden.",
    summary: "Utbyggnad av cykelvägar och gångmiljöer i Örebros tillväxtområden.",
    keywords: ["cykel", "gångmiljö", "hållbarhet", "tillväxt"],
    priority: 7,
    buyer: "Örebro kommun",
  },
  {
    id: "t8",
    title: "E-faktura och betalningsplattform",
    municipalityId: "helsingborg",
    category: "IT & Digitalisering",
    value: 15800000,
    deadline: "2026-10-27",
    posted: "2026-09-20",
    description:
      "Helsingborgs stad behöver en modern betalningsplattform för e-faktura, automatiserad bokföring och integration mot ekonomisystem.",
    summary: "E-faktura och betalning med automatiserad bokföring och GDPR.",
    keywords: ["e-faktura", "betalning", "bokföring", "GDPR"],
    priority: 8,
    buyer: "Helsingborgs stad",
  },
  {
    id: "t9",
    title: "Grön infrastruktur i parker",
    municipalityId: "jonkoping",
    category: "Mark & Miljö",
    value: 24000000,
    deadline: "2027-01-01",
    posted: "2026-09-22",
    description:
      "Jönköpings kommun vill förbättra den gröna infrastrukturen i stadens parker genom träd, biodiversitet och vattenhushållning.",
    summary: "Parkernas gröna infrastruktur med träd, biodiversitet och dagvatten.",
    keywords: ["grön infrastruktur", "park", "biodiversitet", "vatten"],
    priority: 6,
    buyer: "Jönköpings kommun",
  },
  {
    id: "t10",
    title: "Solceller på kommunala tak",
    municipalityId: "nykoping",
    category: "Mark & Miljö",
    value: 19200000,
    deadline: "2027-02-15",
    posted: "2026-09-25",
    description:
      "Nyköpings kommun vill installera solceller på taket av kommunala byggnader för att minska energikostnader och koldioxidavtryck.",
    summary: "Solceller på kommunala tak med projektering, installation och driftöverlämning.",
    keywords: ["solceller", "energi", "tak", "koldioxid"],
    priority: 7,
    buyer: "Nyköpings kommun",
  },
  {
    id: "t11",
    title: "Ny medborgarportal",
    municipalityId: "gavle",
    category: "IT & Digitalisering",
    value: 13500000,
    deadline: "2026-11-25",
    posted: "2026-09-28",
    description:
      "Gävle kommun söker partner för en ny medborgarportal med e-tjänster, digital identitet och personlig profil. Portalen ska uppfylla WCAG 2.2 AA.",
    summary: "Medborgarportal med e-tjänster, BankID och tillgänglighet enligt WCAG 2.2 AA.",
    keywords: ["medborgarportal", "e-tjänster", "digital identitet", "WCAG"],
    priority: 8,
    buyer: "Gävle kommun",
  },
  {
    id: "t12",
    title: "Återvinning och cirkulär ekonomi",
    municipalityId: "boras",
    category: "Mark & Miljö",
    value: 16800000,
    deadline: "2027-01-30",
    posted: "2026-10-01",
    description:
      "Borås Stad vill utveckla återvinningsverksamheten enligt cirkulär ekonomi. Uppdraget omfattar logistik, sortering och återanvändning.",
    summary: "Cirkulär avfallshantering med förbättrad logistik och sortering.",
    keywords: ["återvinning", "cirkulär ekonomi", "logistik", "sortering"],
    priority: 6,
    buyer: "Borås Stad",
  },
  {
    id: "t13",
    title: "Sjukhuslogistik i realtid",
    municipalityId: "karlstad",
    category: "Hälsa & Omsorg",
    value: 21000000,
    deadline: "2027-03-10",
    posted: "2026-10-03",
    description:
      "Region Värmland söker leverantör för en logistikplattform som optimerar transporter av läkemedel, prover och material inom sjukhuset i Karlstad.",
    summary: "Logistikplattform för läkemedel, prover och material i realtid.",
    keywords: ["sjukhus", "logistik", "läkemedel", "realtid"],
    priority: 9,
    buyer: "Region Värmland",
  },
  {
    id: "t14",
    title: "Renovering av äldreboende",
    municipalityId: "umea",
    category: "Bygg & Fastighet",
    value: 38000000,
    deadline: "2027-02-05",
    posted: "2026-10-06",
    description:
      "Umeå kommun vill renovera ett äldreboende med nya rum, gemensamma ytor och förbättrad tillgänglighet.",
    summary: "Renovering av äldreboende med tillgänglighet och nya gemensamma ytor.",
    keywords: ["äldreboende", "renovering", "tillgänglighet", "vård"],
    priority: 8,
    buyer: "Umeå kommun",
  },
  {
    id: "t15",
    title: "Trafikkontrollsystem",
    municipalityId: "lulea",
    category: "IT & Digitalisering",
    value: 17400000,
    deadline: "2026-11-10",
    posted: "2026-10-08",
    description:
      "Luleå kommun söker partner för ett trafikkontrollsystem med sensordata, AI-baserad styrning och realtidsanalys.",
    summary: "Trafikstyrning med sensorer, AI och realtidsanalys för en smartare stad.",
    keywords: ["trafik", "sensorer", "AI", "smart city"],
    priority: 9,
    buyer: "Luleå kommun",
  },
  {
    id: "t16",
    title: "Skogsvård och biologisk mångfald",
    municipalityId: "skelleftea",
    category: "Mark & Miljö",
    value: 11200000,
    deadline: "2027-01-20",
    posted: "2026-10-10",
    description:
      "Skellefteå kommun vill förbättra skogsvården och den biologiska mångfalden i kommunens skogar.",
    summary: "Hållbar skogsskötsel och biodiversitet i kommunala skogar.",
    keywords: ["skog", "mångfald", "hållbarhet", "skötsel"],
    priority: 6,
    buyer: "Skellefteå kommun",
  },
  {
    id: "t17",
    title: "Energisnål ventilation",
    municipalityId: "pitea",
    category: "Bygg & Fastighet",
    value: 14600000,
    deadline: "2026-10-30",
    posted: "2026-10-12",
    description:
      "Piteå kommun vill energieffektivisera ventilationen i kommunens byggnader genom spillvärmeåtervinning och modern styrteknik.",
    summary: "HVAC-uppgradering med spillvärmeåtervinning i kommunala fastigheter.",
    keywords: ["ventilation", "spillvärme", "energi", "HVAC"],
    priority: 7,
    buyer: "Piteå kommun",
  },
  {
    id: "t18",
    title: "Digitala verktyg för barn och unga",
    municipalityId: "kiruna",
    category: "Hälsa & Omsorg",
    value: 9800000,
    deadline: "2026-11-05",
    posted: "2026-10-15",
    description:
      "Kiruna kommun söker partner för digitala verktyg inom socialtjänstens barn och unga, inklusive dokumentation och samverkan.",
    summary: "E-tjänster och dokumentation för barn och unga med höga krav på informationssäkerhet.",
    keywords: ["socialtjänst", "e-tjänster", "dokumentation", "samverkan"],
    priority: 8,
    buyer: "Kiruna kommun",
  },
  {
    id: "t19",
    title: "Återställning av våtmarker",
    municipalityId: "harjedalen",
    category: "Mark & Miljö",
    value: 8500000,
    deadline: "2027-02-20",
    posted: "2026-10-18",
    description:
      "Härjedalens kommun vill återställa våtmarker för biologisk mångfald, vattenkvalitet och klimatanpassning.",
    summary: "Våtmarksåterställning för mångfald, vattenkvalitet och klimat.",
    keywords: ["våtmarker", "mångfald", "vatten", "klimat"],
    priority: 5,
    buyer: "Härjedalens kommun",
  },
  {
    id: "t20",
    title: "Kommunal logistikplattform",
    municipalityId: "ang",
    category: "IT & Digitalisering",
    value: 12300000,
    deadline: "2027-01-10",
    posted: "2026-10-20",
    description:
      "Ånge kommun söker partner för en logistikplattform som optimerar transporter av förvaltningens material och utrustning.",
    summary: "Flödesoptimering och spårning av kommunala transporter.",
    keywords: ["logistik", "transporter", "optimering", "spårning"],
    priority: 7,
    buyer: "Ånge kommun",
  },
  {
    id: "t21",
    title: "Skolplattform och lärverktyg",
    municipalityId: "lund",
    category: "Utbildning",
    value: 18700000,
    deadline: "2026-12-12",
    posted: "2026-10-04",
    description:
      "Lunds kommun upphandlar skolplattform med lärverktyg, vårdnadshavarkommunikation och integration mot nationella register.",
    summary: "Skolplattform med lärverktyg, vårdnadshavare och nationella integrationer.",
    keywords: ["skola", "lärverktyg", "integration", "GDPR"],
    priority: 8,
    buyer: "Lunds kommun",
  },
  {
    id: "t22",
    title: "Hemtjänst natt och helg",
    municipalityId: "eskilstuna",
    category: "Hälsa & Omsorg",
    value: 26400000,
    deadline: "2026-11-22",
    posted: "2026-09-30",
    description:
      "Eskilstuna kommun upphandlar hemtjänst natt och helg enligt LOV med krav på kontinuitet, digital signering och ruttoptimering.",
    summary: "Hemtjänst natt och helg med digital signering och ruttoptimering.",
    keywords: ["hemtjänst", "LOV", "omsorg", "ruttoptimering"],
    priority: 8,
    buyer: "Eskilstuna kommun",
  },
  {
    id: "t23",
    title: "Kompetensutveckling för lärare",
    municipalityId: "vaxjo",
    category: "Utbildning",
    value: 6400000,
    deadline: "2026-12-08",
    posted: "2026-10-11",
    description:
      "Växjö kommun söker ramavtal för kompetensutveckling inom inkludering, AI i undervisning och svenska som andraspråk.",
    summary: "Ramavtal för lärarfortbildning inom inkludering, AI och SVA.",
    keywords: ["utbildning", "fortbildning", "AI", "skola"],
    priority: 6,
    buyer: "Växjö kommun",
  },
  {
    id: "t24",
    title: "Färdtjänst och skolskjuts",
    municipalityId: "visby",
    category: "Hälsa & Omsorg",
    value: 31200000,
    deadline: "2027-01-08",
    posted: "2026-10-09",
    description:
      "Region Gotland upphandlar färdtjänst och skolskjuts med krav på tillgängliga fordon, realtidsspårning och fossilfri drift.",
    summary: "Färdtjänst och skolskjuts med tillgänglighet och fossilfria fordon.",
    keywords: ["färdtjänst", "skolskjuts", "tillgänglighet", "fossilfritt"],
    priority: 7,
    buyer: "Region Gotland",
  },
];

export function deriveStatus(deadline: string): Tender["status"] {
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "closed";
  if (days <= 7) return "closing-soon";
  return "open";
}

export const tenders: Tender[] = rawTenders.map((tender) => ({
  ...tender,
  status: deriveStatus(tender.deadline),
  source: "catalog" as const,
}));

export const categories = [
  "IT & Digitalisering",
  "Bygg & Fastighet",
  "Mark & Miljö",
  "Hälsa & Omsorg",
  "Utbildning",
  "Övrigt",
];

export const regions = [
  ...new Set(municipalities.map((municipality) => municipality.region)),
].sort((a, b) => a.localeCompare(b, "sv"));

export const statusLabels: Record<Tender["status"], string> = {
  open: "Öppen",
  "closing-soon": "Stängs snart",
  closed: "Stängd",
};

export function getMunicipality(id: string) {
  return municipalities.find((municipality) => municipality.id === id);
}

export function computeAnalytics(items: Tender[]): AnalyticsData {
  const open = items.filter((item) => item.status !== "closed");
  const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);
  const months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
  const monthlyMap = new Map<string, { count: number; value: number }>();

  for (const item of items) {
    const date = new Date(item.posted);
    const key = Number.isNaN(date.getTime()) ? "Okänt" : months[date.getMonth()];
    const current = monthlyMap.get(key) ?? { count: 0, value: 0 };
    current.count += 1;
    current.value += item.value || 0;
    monthlyMap.set(key, current);
  }

  const categoryBreakdown = categories
    .map((category) => ({
      category,
      count: items.filter((item) => item.category === category).length,
      value: items.filter((item) => item.category === category).reduce((sum, item) => sum + (item.value || 0), 0),
    }))
    .filter((row) => row.count > 0);

  const groupedRegions = new Map<string, { count: number; value: number }>();
  for (const item of items) {
    const region = getMunicipality(item.municipalityId)?.region ?? "Övriga Sverige";
    const current = groupedRegions.get(region) ?? { count: 0, value: 0 };
    current.count += 1;
    current.value += item.value || 0;
    groupedRegions.set(region, current);
  }

  return {
    totalTenders: items.length,
    totalValue,
    openTenders: open.length,
    avgValue: items.length ? totalValue / items.length : 0,
    monthlyTrends: [...monthlyMap.entries()].map(([month, data]) => ({ month, ...data })),
    categoryBreakdown,
    regionBreakdown: [...groupedRegions.entries()]
      .map(([region, data]) => ({ region, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
  };
}

export const analytics = computeAnalytics(tenders);
