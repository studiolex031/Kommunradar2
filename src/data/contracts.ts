export interface Contract {
  id: string;
  title: string;
  municipality: string;
  region: string;
  category: string;
  value: string;
  valueNumeric: number;
  deadline: string;
  status: 'öppen' | 'stängd' | 'pågående';
  description: string;
  requirements: string[];
  rights: string[];
  conditions: string[];
  eligibleApplicants: string[];
  applicationProcess: string[];
  contactPerson: string;
  contactEmail: string;
  publishedDate: string;
  estimatedDuration: string;
  matchScore?: number;
}

export const contracts: Contract[] = [
  {
    id: '1',
    title: 'Renovering av kommunala bostäder - Miljonprogrammet',
    municipality: 'Stockholms stad',
    region: 'Stockholms län',
    category: 'Bygg & Renovering',
    value: '45 000 000 SEK',
    valueNumeric: 45000000,
    deadline: '2026-03-15',
    status: 'öppen',
    description: 'Stockholms stad söker entreprenör för omfattande renovering av 120 lägenheter i miljonprogramsområdet. Arbetet inkluderar stambyte, fasadrenovering, energieffektivisering och tillgänglighetsanpassning.',
    requirements: ['Minst 5 års erfarenhet av liknande projekt', 'ISO 9001-certifiering', 'Referensprojekt över 20 MSEK', 'Lokalt etablerade i Stockholmsregionen', 'Miljöcertifiering enligt ISO 14001'],
    rights: ['Rätt till betalning inom 30 dagar enligt LOU', 'Rätt till omförhandling vid väsentliga ändringar', 'Rätt till skälig vinstmarginal', 'Rätt till förlängning vid oförutsedda hinder'],
    conditions: ['Lön enligt kollektivavtal', 'Miljökrav enligt kommunens hållbarhetspolicy', 'Rapportering varannan vecka', 'Garantitid 5 år på utfört arbete'],
    eligibleApplicants: ['Byggföretag med omsättning över 50 MSEK', 'Entreprenörer med godkänd ekonomisk stabilitet', 'Företag registrerade i Sverige eller EU/EES', 'Leverantörer utan anmärkningar i Bolagsverket'],
    applicationProcess: ['Registrera intresse via kommunens upphandlingsportal', 'Ladda ner förfrågningsunderlag', 'Skicka in anbud senast deadline', 'Delta i eventuell förhandling/precisering', 'Vänta på utvärdering och tilldelning'],
    contactPerson: 'Anna Lindström',
    contactEmail: 'anna.lindstrom@stockholm.se',
    publishedDate: '2026-01-10',
    estimatedDuration: '18 månader'
  },
  {
    id: '2',
    title: 'IT-drift och support för grundskolor',
    municipality: 'Göteborgs stad',
    region: 'Västra Götaland',
    category: 'IT & Teknik',
    value: '12 500 000 SEK',
    valueNumeric: 12500000,
    deadline: '2026-02-28',
    status: 'öppen',
    description: 'Göteborgs stad upphandlar IT-drift och teknisk support för 85 grundskolor. Tjänsten omfattar helpdesk, hårdvaruhantering, nätverkssupport och utbildningsstöd för lärare.',
    requirements: ['Erfarenhet av IT-drift i skolmiljö', 'Minst 20 tekniker tillgängliga', 'Support på svenska och engelska', 'Respons tid under 2 timmar', 'Certifierade tekniker (Microsoft, Cisco)'],
    rights: ['Rätt till årlig prisjustering enligt SCB', 'Rätt till ersättning för merarbete', 'Rätt till uppsägning med 6 månaders varsel', 'Rätt till subkontraktering med godkännande'],
    conditions: ['Tystnadsplikt enligt GDPR', 'Bakgrundskontroll av all personal', 'Tillgänglighet 07:00-18:00 vardagar', 'Kvartalsrapportering till kommunen'],
    eligibleApplicants: ['IT-företag med minst 3 års erfarenhet', 'Företag med minst 20 anställda', 'Leverantörer med referenser från offentlig sektor', 'Företag med god kreditvärdighet'],
    applicationProcess: ['Ansök via Mercell upphandlingsplattform', 'Genomgå kvalificeringsgranskning', 'Lämna anbud med teknisk och ekonomisk offert', 'Delta i presentationsmöte vid behov', 'Avtalsundertecknande efter tilldelning'],
    contactPerson: 'Erik Johansson',
    contactEmail: 'erik.johansson@goteborg.se',
    publishedDate: '2026-01-05',
    estimatedDuration: '3 år + option 1+1 år'
  },
  {
    id: '3',
    title: 'Omsorgstjänster - Hemtjänst och personlig assistans',
    municipality: 'Malmö stad',
    region: 'Skåne län',
    category: 'Vård & Omsorg',
    value: '78 000 000 SEK',
    valueNumeric: 78000000,
    deadline: '2026-04-01',
    status: 'pågående',
    description: 'Malmö stad upphandlar hemtjänst och personlig assistans för äldre och personer med funktionsnedsättning. Avtalet täcker hela Malmö stad med uppdelning i 5 geografiska områden.',
    requirements: ['Tillstånd från IVO', 'Minst 50 undersköterskor', 'Erfarenhet av demensvård', 'Språkkunskaper i minst 3 språk utöver svenska', 'Egen bilpark eller leasingavtal'],
    rights: ['Rätt till volymgaranti enligt avtal', 'Rätt till kompensation vid lagändringar', 'Rätt till årlig omförhandling', 'Rätt till investeringstöd vid utökning'],
    conditions: ['Kollektivavtal är obligatoriskt', 'Kontinuerlig kompetensutveckling', 'Dygnet-runt-beredskap krävs', 'Kvalitetsrevision 2 gånger per år'],
    eligibleApplicants: ['Vård- och omsorgsföretag med IVO-tillstånd', 'Organisationer med minst 3 års erfarenhet', 'Företag utan allvarliga brister i tidigare uppdrag', 'Leverantörer med stabil ekonomi och försäkringar'],
    applicationProcess: ['Ansök om kvalificering via Visma TendSign', 'Verifiera IVO-tillstånd och referenser', 'Lämna detaljerat anbud per geografiskt område', 'Delta i utvärderingsdialog', 'Teckna ramavtal vid tilldelning'],
    contactPerson: 'Maria Svensson',
    contactEmail: 'maria.svensson@malmo.se',
    publishedDate: '2025-12-15',
    estimatedDuration: '4 år'
  },
  {
    id: '4',
    title: 'Upprustning av lekplatser och utemiljöer',
    municipality: 'Uppsala kommun',
    region: 'Uppsala län',
    category: 'Mark & Anläggning',
    value: '8 200 000 SEK',
    valueNumeric: 8200000,
    deadline: '2026-03-30',
    status: 'öppen',
    description: 'Uppsala kommun söker entreprenör för upprustning av 15 kommunala lekplatser. Projektet inkluderar nya lekredskap, fallskyddsunderlag, belysning och tillgänglighetsanpassning.',
    requirements: ['Erfarenhet av lekplatsbyggnation', 'Certifierade installatörer av fallskyddsunderlag', 'Kunskap om EN 1176', 'Miljöanpassade materialval', 'Referensprojekt från minst 3 kommuner'],
    rights: ['Rätt till delbetalning enligt framdrift', 'Rätt till justering vid materialprisökningar', 'Rätt till förlängning vid väderrelaterade förseningar', 'Rätt till ersättning för merkostnader vid ändringar'],
    conditions: ['Arbetet ska utföras under sommarmånaderna', 'Bullerrestriktioner i bostadsområden', 'Miljöplan ska lämnas innan start', 'Besiktning av varje lekplats vid färdigställande'],
    eligibleApplicants: ['Anläggningsföretag med specialisering på lekplatser', 'Företag med certifierade montörer', 'Leverantörer med godkända materialleverantörer', 'Entreprenörer med ansvarsförsäkring min 10 MSEK'],
    applicationProcess: ['Ladda ner förfrågningsunderlag från kommunens hemsida', 'Genomför platsbesök (obligatoriskt)', 'Lämna anbud med detaljerad kostnadskalkyl', 'Presentera tidplan och materialval', 'Avtalsstart efter utvärdering'],
    contactPerson: 'Johan Berg',
    contactEmail: 'johan.berg@uppsala.se',
    publishedDate: '2026-01-20',
    estimatedDuration: '6 månader'
  },
  {
    id: '5',
    title: 'Skolmåltider - Leverans och produktion',
    municipality: 'Linköpings kommun',
    region: 'Östergötland',
    category: 'Livsmedel & Måltider',
    value: '32 000 000 SEK',
    valueNumeric: 32000000,
    deadline: '2026-05-15',
    status: 'öppen',
    description: 'Linköpings kommun upphandlar produktion och leverans av skolmåltider för 42 skolenheter. Cirka 12 000 måltider per dag ska produceras och levereras.',
    requirements: ['Godkänd livsmedelsproduktion', 'HACCP-certifiering', 'Eget produktionskök inom 30 km radie', 'Kapacitet för 12 000+ måltider/dag', 'Ekologisk andel minst 40%'],
    rights: ['Rätt till volymjustering vid förändrat elevunderlag', 'Rätt till prisreglering vid råvaruprishöjningar', 'Rätt till investering i anpassning av kök', 'Rätt till avtalsförlängning vid god prestation'],
    conditions: ['Svenskt kött som grundkrav', 'Allergianpassade alternativ alltid tillgängliga', 'Näringsberäkning enligt Livsmedelsverket', 'Elevinflytande i menyplanering'],
    eligibleApplicants: ['Storköksföretag med dokumenterad erfarenhet', 'Leverantörer med HACCP-system', 'Företag med egen produktionskapacitet', 'Organisationer med miljöledningssystem'],
    applicationProcess: ['Anmäl intresse via Doffy upphandlingsportal', 'Lämna kvalitetsanbud med menyförslag', 'Genomgå referenstagning och köksbesök', 'Delta i smakprovning/utvärdering', 'Teckna avtal efter totalutvärdering'],
    contactPerson: 'Karin Nilsson',
    contactEmail: 'karin.nilsson@linkoping.se',
    publishedDate: '2026-01-25',
    estimatedDuration: '3 år + option 2 år'
  },
  {
    id: '6',
    title: 'Konsulttjänster - Hållbarhetsstrategi',
    municipality: 'Helsingborgs stad',
    region: 'Skåne län',
    category: 'Konsulttjänster',
    value: '4 800 000 SEK',
    valueNumeric: 4800000,
    deadline: '2026-02-15',
    status: 'stängd',
    description: 'Helsingborgs stad söker konsult för utveckling av kommunens långsiktiga hållbarhetsstrategi 2026-2035.',
    requirements: ['Minst 10 års erfarenhet av hållbarhetsarbete', 'Dokumenterad erfarenhet från kommunal sektor', 'Kunskap om Agenda 2030 och EU-direktiv', 'Team med minst 4 seniora konsulter', 'Referenser från minst 5 kommuner'],
    rights: ['Rätt till förlängning vid oförutsedda behov', 'Rätt till ersättning för restid och utlägg', 'Rätt till publicering av resultat', 'Rätt till fortsatt dialog vid implementering'],
    conditions: ['Alla leveranser på svenska', 'Månadsvisa avstämningar med styrgrupp', 'Immateriella rättigheter tillfaller kommunen', 'Sekretess gällande intern information'],
    eligibleApplicants: ['Konsultbolag med hållbarhetsinriktning', 'Företag med akademiskt utbildad personal', 'Organisationer med kommunal erfarenhet', 'Leverantörer utan intressekonflikter'],
    applicationProcess: ['Ansök via e-avrop', 'Lämna metodbeskrivning och CV', 'Presentera referensuppdrag', 'Delta i presentationsmöte', 'Utvärdering enligt MEPRIN-modellen'],
    contactPerson: 'Per Andersson',
    contactEmail: 'per.andersson@helsingborg.se',
    publishedDate: '2025-11-20',
    estimatedDuration: '12 månader'
  },
  {
    id: '7',
    title: 'Solcellsanläggningar för kommunala fastigheter',
    municipality: 'Växjö kommun',
    region: 'Kronobergs län',
    category: 'Energi & Miljö',
    value: '18 500 000 SEK',
    valueNumeric: 18500000,
    deadline: '2026-04-20',
    status: 'öppen',
    description: 'Växjö kommun upphandlar leverans och installation av solcellsanläggningar på 25 kommunala fastigheter. Målet är att minska energikostnader och bidra till fossilfri energiproduktion.',
    requirements: ['Erfarenhet av solcellsinstallationer', 'Certifierade elektriker', 'Garanti minst 25 år på paneler', 'Projektering och montage', 'Drift och underhållsavtal'],
    rights: ['Rätt till avräkning mot energibesparing', 'Rätt till förlängning vid leveransproblem', 'Rätt till justering vid förändrade regelverk', 'Rätt till referensanvändning efter projekt'],
    conditions: ['Svenska solcellsmoduler prioriteras', 'Miljöplan för montage', 'Utbildning av fastighetspersonal', 'Mätning och rapportering av produktion'],
    eligibleApplicants: ['Energiteknikföretag med solcellsspecialisering', 'Installatörer med behörighet', 'Företag med minst 5 års erfarenhet', 'Leverantörer med god ekonomisk stabilitet'],
    applicationProcess: ['Anmäl intresse via Doffy', 'Lämna teknisk beskrivning och offert', 'Presentera referensprojekt', 'Delta i förhandlingsmöte', 'Avtalstecknande efter utvärdering'],
    contactPerson: 'Lars Eriksson',
    contactEmail: 'lars.eriksson@vaxjo.se',
    publishedDate: '2026-01-15',
    estimatedDuration: '12 månader'
  },
  {
    id: '8',
    title: 'Tandvård för äldre - Mobila team',
    municipality: 'Umeå kommun',
    region: 'Västerbottens län',
    category: 'Vård & Omsorg',
    value: '15 000 000 SEK',
    valueNumeric: 15000000,
    deadline: '2026-03-25',
    status: 'öppen',
    description: 'Umeå kommun söker leverantör av mobil tandvård för äldre på särskilda boenden och i hemmet. Tjänsten ska täcka hela kommunen med fokus på prevention och akutvård.',
    requirements: ['Legitimerade tandläkare och tandhygienister', 'Mobil utrustning som uppfyller Socialstyrelsens krav', 'Erfarenhet av äldrevård', 'Tillgänglighet inom 48 timmar', 'Journalhantering enligt patientsäkerhetslagen'],
    rights: ['Rätt till volymersättning', 'Rätt till årlig prisrevision', 'Rätt till utrustningsbidrag', 'Rätt till avtalsförlängning vid god kvalitet'],
    conditions: ['Kvalitetsregister ska föras', 'Patientnöjdhet mätas årligen', 'Samarbete med kommunal tandvård', 'Rapportering av avvikelser'],
    eligibleApplicants: ['Tandvårdsföretag med legitimerad personal', 'Organisationer med mobil kapacitet', 'Företag med erfarenhet av äldretandvård', 'Leverantörer med IFO-tillstånd'],
    applicationProcess: ['Ansök via kommunens portal', 'Verifiera legitimationer och tillstånd', 'Lämna anbud med pris per åtgärd', 'Genomgå kvalitetsgranskning', 'Teckna avtal efter utvärdering'],
    contactPerson: 'Sofia Lindgren',
    contactEmail: 'sofia.lindgren@umea.se',
    publishedDate: '2026-01-18',
    estimatedDuration: '3 år'
  },
  {
    id: '9',
    title: 'Kollektivtrafik - Busslinjer i glesbygd',
    municipality: 'Region Jämtland',
    region: 'Jämtlands län',
    category: 'Transport & Logistik',
    value: '95 000 000 SEK',
    valueNumeric: 95000000,
    deadline: '2026-06-01',
    status: 'öppen',
    description: 'Region Jämtland upphandlar busstrafik i glesbygdsområden. Kontraktet omfattar 15 linjer med cirka 2 miljoner resenärer per år. Miljökrav: fossilfria fordon.',
    requirements: ['Tillstånd för yrkesmässig trafik', 'Fossilfria fordon (el/biogas/HVO)', 'Tillgänglighet enligt trafikförordningen', 'Biljettsystem kompatibelt med regionens system', 'Erfarenhet av glesbygdstrafik'],
    rights: ['Rätt till kompensation vid bränsleprisökningar', 'Rätt till omförhandling av tidtabeller', 'Rätt till investering i fordonsflotta', 'Rätt till förlängning vid god kvalitet'],
    conditions: ['Förarkrav: god lokalkännedom', 'Tillgänglighetsutbildning för personal', 'Realtime-positionering av fordon', 'Kundnöjdhetsundersökning 2 ggr/år'],
    eligibleApplicants: ['Bussföretag med trafiklicens', 'Operatörer med fossilfri fordonsflotta', 'Företag med erfarenhet av regiontrafik', 'Leverantörer med god ekonomisk ställning'],
    applicationProcess: ['Anmäl intresse via Merqell', 'Verifiera tillstånd och fordonsflotta', 'Lämna anbud med tidtabellsförslag', 'Genomgå trafiksäkerhetsgranskning', 'Teckna trafikavtal'],
    contactPerson: 'Mikael Holmström',
    contactEmail: 'mikael.holmstrom@regionjt.se',
    publishedDate: '2026-01-28',
    estimatedDuration: '8 år'
  },
  {
    id: '10',
    title: 'Digitaliseringskonsult - E-tjänster',
    municipality: 'Lunds kommun',
    region: 'Skåne län',
    category: 'IT & Teknik',
    value: '6 200 000 SEK',
    valueNumeric: 6200000,
    deadline: '2026-03-10',
    status: 'öppen',
    description: 'Lunds kommun söker konsult för utveckling av nya e-tjänster och digitalisering av medborgarservice. Fokus på tillgänglighet, användarvänlighet och säkerhet.',
    requirements: ['Erfarenhet av e-tjänsteutveckling', 'Kunskap om WCAG 2.1 AA', 'Erfarenhet av offentlig sektor', 'Agil utvecklingsmetodik', 'Kunskap om e-legitimationer'],
    rights: ['Rätt till immateriellt skydd för egen IP', 'Rätt till förlängning vid behov', 'Rätt till referensanvändning', 'Rätt till skälig ersättning för merarbete'],
    conditions: ['Kodägande tillfaller kommunen', 'Dokumentation på svenska', 'Tillgänglighetsgranskning obligatorisk', 'Säkerhetsrevision innan lansering'],
    eligibleApplicants: ['IT-konsultbolag med digitaliseringsfokus', 'Företag med erfarenhet av e-förvaltning', 'Leverantörer med kunskap om offentlig sektor', 'Organisationer med agila team'],
    applicationProcess: ['Ansök via Doffy', 'Lämna metodbeskrivning och CV', 'Presentera relevanta projekt', 'Delta i intervju', 'Avtal efter utvärdering'],
    contactPerson: 'Helena Karlsson',
    contactEmail: 'helena.karlsson@lund.se',
    publishedDate: '2026-01-22',
    estimatedDuration: '12 månader'
  },
  {
    id: '11',
    title: 'Byggande av nytt äldreboende',
    municipality: 'Örebro kommun',
    region: 'Örebro län',
    category: 'Bygg & Renovering',
    value: '120 000 000 SEK',
    valueNumeric: 120000000,
    deadline: '2026-05-30',
    status: 'öppen',
    description: 'Örebro kommun upphandlar totalentreprenad för byggande av nytt äldreboende med 80 platser. Byggnaden ska vara miljöcertifierad enligt Miljöbyggnad Silver.',
    requirements: ['Totalentreprenörer med erfarenhet av vårdbyggnader', 'Miljöbyggnad-certifiering', 'Minst 3 referensobjekt över 80 MSEK', 'Lokalt kontor i regionen', 'ISO 9001 och ISO 14001'],
    rights: ['Rätt till delbetalning enligt produktionsplan', 'Rätt till justering vid oförutsedda markförhållanden', 'Rätt till förlängning vid force majeure', 'Rätt till skälig vinst enligt ABT 06'],
    conditions: ['Byggtid max 24 månader', 'Miljöbyggnad Silver som minimikrav', 'Tillgänglighetsanpassning enligt BBR', 'Garantitid 5 år'],
    eligibleApplicants: ['Byggföretag med omsättning över 200 MSEK', 'Entreprenörer med vårdbyggnadserfarenhet', 'Företag med stabil ekonomi', 'Leverantörer med fullständig försäkring'],
    applicationProcess: ['Kvalificeringsansökan via Mercell', 'Verifiering av ekonomisk ställning', 'Lämna tekniskt anbud med handlingar', 'Delta i förhandlingsmöte', 'Avtalstecknande efter utvärdering'],
    contactPerson: 'Anders Gustafsson',
    contactEmail: 'anders.gustafsson@orebro.se',
    publishedDate: '2026-02-01',
    estimatedDuration: '24 månader'
  },
  {
    id: '12',
    title: 'Kulturprogram för bibliotek',
    municipality: 'Norrköpings kommun',
    region: 'Östergötland',
    category: 'Kultur & Fritid',
    value: '3 500 000 SEK',
    valueNumeric: 3500000,
    deadline: '2026-04-10',
    status: 'öppen',
    description: 'Norrköpings kommun upphandlar kulturprogram för 8 bibliotek under 2026. Programmet ska inkludera författarbesök, musik, teater och workshops för alla åldrar.',
    requirements: ['Erfarenhet av kulturproduktion', 'Nätverk av kulturutövare', 'Erfarenhet av barn- och ungdomsprogram', 'Tillgång till lokaler eller mobila lösningar', 'Kunskap om biblioteksmiljö'],
    rights: ['Rätt till kreativ frihet inom ramarna', 'Rätt till marknadsföringsstöd', 'Rätt till förlängning vid framgång', 'Rätt till ersättning för materialkostnader'],
    conditions: ['Program ska vara kostnadsfritt för besökare', 'Minst 50 programpunkter per år', 'Utvärdering av deltagarnöjdhet', 'Rapportering varje kvartal'],
    eligibleApplicants: ['Kulturproduktionsföretag', 'Ideella organisationer med kulturinriktning', 'Evenemangsarrangörer med erfarenhet', 'Leverantörer med nätverk i kulturlivet'],
    applicationProcess: ['Ansök via kommunens kulturportal', 'Lämna programförslag med budget', 'Presentera referenser och nätverk', 'Delta i presentationsmöte', 'Avtal efter utvärdering'],
    contactPerson: 'Eva Magnusson',
    contactEmail: 'eva.magnusson@norrkoping.se',
    publishedDate: '2026-01-30',
    estimatedDuration: '12 månader'
  }
];

export const categories = [
  'Alla kategorier',
  'Bygg & Renovering',
  'IT & Teknik',
  'Vård & Omsorg',
  'Mark & Anläggning',
  'Livsmedel & Måltider',
  'Konsulttjänster',
  'Energi & Miljö',
  'Transport & Logistik',
  'Kultur & Fritid'
];

export const regions = [
  'Hela Sverige',
  'Stockholms län',
  'Västra Götaland',
  'Skåne län',
  'Uppsala län',
  'Östergötland',
  'Kronobergs län',
  'Västerbottens län',
  'Jämtlands län',
  'Örebro län'
];

export const statusOptions = ['Alla statusar', 'öppen', 'pågående', 'stängd'];

export const valueRanges = [
  { label: 'Alla värden', min: 0, max: Infinity },
  { label: 'Under 5 MSEK', min: 0, max: 5000000 },
  { label: '5-20 MSEK', min: 5000000, max: 20000000 },
  { label: '20-50 MSEK', min: 20000000, max: 50000000 },
  { label: 'Över 50 MSEK', min: 50000000, max: Infinity },
];

export const timeRanges = [
  { label: 'Alla tidsperioder', days: Infinity },
  { label: 'Inom 7 dagar', days: 7 },
  { label: 'Inom 14 dagar', days: 14 },
  { label: 'Inom 30 dagar', days: 30 },
  { label: 'Inom 90 dagar', days: 90 },
];
