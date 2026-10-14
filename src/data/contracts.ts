export interface Contract {
  id: string;
  title: string;
  municipality: string;
  region: string;
  category: string;
  value: string;
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
}

export const contracts: Contract[] = [
  {
    id: '1',
    title: 'Renovering av kommunala bostäder - Miljonprogrammet',
    municipality: 'Stockholms stad',
    region: 'Stockholms län',
    category: 'Bygg & Renovering',
    value: '45 000 000 SEK',
    deadline: '2026-03-15',
    status: 'öppen',
    description: 'Stockholms stad söker entreprenör för omfattande renovering av 120 lägenheter i miljonprogramsområdet. Arbetet inkluderar stambyte, fasadrenovering, energieffektivisering och tillgänglighetsanpassning.',
    requirements: [
      'Minst 5 års erfarenhet av liknande projekt',
      'ISO 9001-certifiering',
      'Referensprojekt över 20 MSEK',
      'Lokalt etablerade i Stockholmsregionen',
      'Miljöcertifiering enligt ISO 14001'
    ],
    rights: [
      'Rätt till betalning inom 30 dagar enligt LOU',
      'Rätt till omförhandling vid väsentliga ändringar',
      'Rätt till skälig vinstmarginal',
      'Rätt till förlängning vid oförutsedda hinder'
    ],
    conditions: [
      'Lön enligt kollektivavtal',
      'Miljökrav enligt kommunens hållbarhetspolicy',
      'Rapportering varannan vecka',
      'Garantitid 5 år på utfört arbete'
    ],
    eligibleApplicants: [
      'Byggföretag med omsättning över 50 MSEK',
      'Entreprenörer med godkänd ekonomisk stabilitet',
      'Företag registrerade i Sverige eller EU/EES',
      'Leverantörer utan anmärkningar i Bolagsverket'
    ],
    applicationProcess: [
      'Registrera intresse via kommunens upphandlingsportal',
      'Ladda ner förfrågningsunderlag',
      'Skicka in anbud senast deadline',
      'Delta i eventuell förhandling/precisering',
      'Vänta på utvärdering och tilldelning'
    ],
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
    deadline: '2026-02-28',
    status: 'öppen',
    description: 'Göteborgs stad upphandlar IT-drift och teknisk support för 85 grundskolor. Tjänsten omfattar helpdesk, hårdvaruhantering, nätverkssupport och utbildningsstöd för lärare.',
    requirements: [
      'Erfarenhet av IT-drift i skolmiljö',
      'Minst 20 tekniker tillgängliga',
      'Support på svenska och engelska',
      'Respons tid under 2 timmar',
      'Certifierade tekniker (Microsoft, Cisco)'
    ],
    rights: [
      'Rätt till årlig prisjustering enligt SCB',
      'Rätt till ersättning för merarbete',
      'Rätt till uppsägning med 6 månaders varsel',
      'Rätt till subkontraktering med godkännande'
    ],
    conditions: [
      'Tystnadsplikt enligt GDPR',
      'Bakgrundskontroll av all personal',
      'Tillgänglighet 07:00-18:00 vardagar',
      'Kvartalsrapportering till kommunen'
    ],
    eligibleApplicants: [
      'IT-företag med minst 3 års erfarenhet',
      'Företag med minst 20 anställda',
      'Leverantörer med referenser från offentlig sektor',
      'Företag med god kreditvärdighet'
    ],
    applicationProcess: [
      'Ansök via Mercell upphandlingsplattform',
      'Genomgå kvalificeringsgranskning',
      'Lämna anbud med teknisk och ekonomisk offert',
      'Delta i presentationsmöte vid behov',
      'Avtalsundertecknande efter tilldelning'
    ],
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
    deadline: '2026-04-01',
    status: 'pågående',
    description: 'Malmö stad upphandlar hemtjänst och personlig assistans för äldre och personer med funktionsnedsättning. Avtalet täcker hela Malmö stad med uppdelning i 5 geografiska områden.',
    requirements: [
      'Tillstånd från IVO (Inspektionen för vård och omsorg)',
      'Minst 50 undersköterskor',
      'Erfarenhet av demensvård',
      'Språkkunskaper i minst 3 språk utöver svenska',
      'Egen bilpark eller leasingavtal'
    ],
    rights: [
      'Rätt till volymgaranti enligt avtal',
      'Rätt till kompensation vid lagändringar',
      'Rätt till årlig omförhandling',
      'Rätt till investeringstöd vid utökning'
    ],
    conditions: [
      'Kollektivavtal är obligatoriskt',
      'Kontinuerlig kompetensutveckling',
      'Dygnet-runt-beredskap krävs',
      'Kvalitetsrevision 2 gånger per år'
    ],
    eligibleApplicants: [
      'Vård- och omsorgsföretag med IVO-tillstånd',
      'Organisationer med minst 3 års erfarenhet',
      'Företag utan allvarliga brister i tidigare uppdrag',
      'Leverantörer med stabil ekonomi och försäkringar'
    ],
    applicationProcess: [
      'Ansök om kvalificering via Visma TendSign',
      'Verifiera IVO-tillstånd och referenser',
      'Lämna detaljerat anbud per geografiskt område',
      'Delta i utvärderingsdialog',
      'Teckna ramavtal vid tilldelning'
    ],
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
    deadline: '2026-03-30',
    status: 'öppen',
    description: 'Uppsala kommun söker entreprenör för upprustning av 15 kommunala lekplatser. Projektet inkluderar nya lekredskap, fallskyddsunderlag, belysning och tillgänglighetsanpassning.',
    requirements: [
      'Erfarenhet av lekplatsbyggnation',
      'Certifierade installatörer av fallskyddsunderlag',
      'Kunskap om EN 1176 (lekplatsstandard)',
      'Miljöanpassade materialval',
      'Referensprojekt från minst 3 kommuner'
    ],
    rights: [
      'Rätt till delbetalning enligt framdrift',
      'Rätt till justering vid materialprisökningar',
      'Rätt till förlängning vid väderrelaterade förseningar',
      'Rätt till ersättning för merkostnader vid ändringar'
    ],
    conditions: [
      'Arbetet ska utföras under sommarmånaderna',
      'Bullerrestriktioner i bostadsområden',
      'Miljöplan ska lämnas innan start',
      'Besiktning av varje lekplats vid färdigställande'
    ],
    eligibleApplicants: [
      'Anläggningsföretag med specialisering på lekplatser',
      'Företag med certifierade montörer',
      'Leverantörer med godkända materialleverantörer',
      'Entreprenörer med ansvarsförsäkring min 10 MSEK'
    ],
    applicationProcess: [
      'Ladda ner förfrågningsunderlag från kommunens hemsida',
      'Genomför platsbesök (obligatoriskt)',
      'Lämna anbud med detaljerad kostnadskalkyl',
      'Presentera tidplan och materialval',
      'Avtalsstart efter utvärdering'
    ],
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
    deadline: '2026-05-15',
    status: 'öppen',
    description: 'Linköpings kommun upphandlar produktion och leverans av skolmåltider för 42 skolenheter. Cirka 12 000 måltider per dag ska produceras och levereras med fokus på näringsriktighet och hållbarhet.',
    requirements: [
      'Godkänd livsmedelsproduktion (Kontrollprogram)',
      'HACCP-certifiering',
      'Eget produktionskök inom 30 km radie',
      'Kapacitet för 12 000+ måltider/dag',
      'Ekologisk andel minst 40%'
    ],
    rights: [
      'Rätt till volymjustering vid förändrat elevunderlag',
      'Rätt till prisreglering vid råvaruprishöjningar',
      'Rätt till investering i anpassning av kök',
      'Rätt till avtalsförlängning vid god prestation'
    ],
    conditions: [
      'Svenskt kött som grundkrav',
      'Allergianpassade alternativ alltid tillgängliga',
      'Näringsberäkning enligt Livsmedelsverket',
      'Elevinflytande i menyplanering'
    ],
    eligibleApplicants: [
      'Storköksföretag med dokumenterad erfarenhet',
      'Leverantörer med HACCP-system',
      'Företag med egen produktionskapacitet',
      'Organisationer med miljöledningssystem'
    ],
    applicationProcess: [
      'Anmäl intresse via Doffy upphandlingsportal',
      'Lämna kvalitetsanbud med menyförslag',
      'Genomgå referenstagning och köksbesök',
      'Delta i smakprovning/utvärdering',
      'Teckna avtal efter totalutvärdering'
    ],
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
    deadline: '2026-02-15',
    status: 'stängd',
    description: 'Helsingborgs stad söker konsult för utveckling av kommunens långsiktiga hållbarhetsstrategi 2026-2035. Uppdraget omfattar analys, strategiutveckling, handlingsplaner och implementeringsstöd.',
    requirements: [
      'Minst 10 års erfarenhet av hållbarhetsarbete',
      'Dokumenterad erfarenhet från kommunal sektor',
      'Kunskap om Agenda 2030 och EU-direktiv',
      'Team med minst 4 seniora konsulter',
      'Referenser från minst 5 kommuner'
    ],
    rights: [
      'Rätt till förlängning vid oförutsedda behov',
      'Rätt till ersättning för restid och utlägg',
      'Rätt till publicering av resultat (med godkännande)',
      'Rätt till fortsatt dialog vid implementering'
    ],
    conditions: [
      'Alla leveranser på svenska',
      'Månadsvisa avstämningar med styrgrupp',
      'Immateriella rättigheter tillfaller kommunen',
      'Sekretess gällande intern information'
    ],
    eligibleApplicants: [
      'Konsultbolag med hållbarhetsinriktning',
      'Företag med akademiskt utbildad personal',
      'Organisationer med kommunal erfarenhet',
      'Leverantörer utan intressekonflikter'
    ],
    applicationProcess: [
      'Ansök via e-avrop',
      'Lämna metodbeskrivning och CV för nyckelpersoner',
      'Presentera referensuppdrag',
      'Delta i presentationsmöte',
      'Utvärdering enligt MEPRIN-modellen'
    ],
    contactPerson: 'Per Andersson',
    contactEmail: 'per.andersson@helsingborg.se',
    publishedDate: '2025-11-20',
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
  'Konsulttjänster'
];

export const regions = [
  'Alla regioner',
  'Stockholms län',
  'Västra Götaland',
  'Skåne län',
  'Uppsala län',
  'Östergötland'
];
