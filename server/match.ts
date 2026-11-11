/**
 * Deterministisk matchning för "Missade upphandlingar" (30-dagarsdemon).
 *
 * Ren logik utan nätverk: samma indata ger alltid samma svar, och varje träff
 * bär med sig varför den matchade (sökord, fält, utdrag, hur länet avgjordes).
 * Saknas uppgift om län räknas annonsen aldrig som träff i länet – den hamnar
 * i en egen lista ("län ej angivet") så att siffran i rubriken går att lita på.
 */

export type County = {
  id: string;
  name: string;
  /** NUTS 3-kod för länet */
  nuts: string;
  /** Orter och myndighetsnamn som entydigt pekar på länet (gemener) */
  places: string[];
};

export const COUNTIES: County[] = [
  { id: "stockholm", name: "Stockholms län", nuts: "SE110", places: ["stockholm", "solna", "sundbyberg", "södertälje", "nacka", "huddinge", "täby", "järfälla", "haninge", "botkyrka", "norrtälje", "lidingö", "sollentuna", "upplands väsby", "tyresö", "värmdö", "sigtuna"] },
  { id: "uppsala", name: "Uppsala län", nuts: "SE121", places: ["uppsala", "enköping", "knivsta", "tierp", "östhammar", "håbo", "älvkarleby"] },
  { id: "sodermanland", name: "Södermanlands län", nuts: "SE122", places: ["södermanland", "sörmland", "eskilstuna", "nyköping", "katrineholm", "strängnäs", "flen", "oxelösund", "trosa", "gnesta"] },
  { id: "ostergotland", name: "Östergötlands län", nuts: "SE123", places: ["östergötland", "linköping", "norrköping", "motala", "mjölby", "finspång", "söderköping", "åtvidaberg"] },
  { id: "orebro", name: "Örebro län", nuts: "SE124", places: ["örebro", "karlskoga", "kumla", "lindesberg", "hallsberg", "askersund", "nora", "degerfors"] },
  { id: "vastmanland", name: "Västmanlands län", nuts: "SE125", places: ["västmanland", "västerås", "köping", "sala", "fagersta", "hallstahammar", "arboga", "surahammar"] },
  { id: "jonkoping", name: "Jönköpings län", nuts: "SE211", places: ["jönköping", "värnamo", "nässjö", "vetlanda", "gislaved", "tranås", "eksjö", "sävsjö", "habo"] },
  { id: "kronoberg", name: "Kronobergs län", nuts: "SE212", places: ["kronoberg", "växjö", "ljungby", "älmhult", "alvesta", "markaryd", "tingsryd"] },
  { id: "kalmar", name: "Kalmar län", nuts: "SE213", places: ["kalmar", "västervik", "oskarshamn", "nybro", "vimmerby", "borgholm", "mörbylånga", "hultsfred"] },
  { id: "gotland", name: "Gotlands län", nuts: "SE214", places: ["gotland", "visby"] },
  { id: "blekinge", name: "Blekinge län", nuts: "SE221", places: ["blekinge", "karlskrona", "karlshamn", "ronneby", "sölvesborg", "olofström"] },
  { id: "skane", name: "Skåne län", nuts: "SE224", places: ["skåne", "malmö", "helsingborg", "lund", "kristianstad", "landskrona", "trelleborg", "ängelholm", "hässleholm", "ystad", "eslöv", "höganäs", "staffanstorp", "lomma", "vellinge"] },
  { id: "halland", name: "Hallands län", nuts: "SE231", places: ["halland", "halmstad", "varberg", "kungsbacka", "falkenberg", "laholm", "hylte"] },
  { id: "vastra-gotaland", name: "Västra Götalands län", nuts: "SE232", places: ["västra götaland", "göteborg", "borås", "mölndal", "trollhättan", "uddevalla", "skövde", "kungälv", "lerum", "partille", "alingsås", "vänersborg", "lidköping", "falköping", "mariestad", "härryda", "stenungsund"] },
  { id: "varmland", name: "Värmlands län", nuts: "SE311", places: ["värmland", "karlstad", "arvika", "kristinehamn", "säffle", "hammarö", "sunne", "torsby", "filipstad"] },
  { id: "dalarna", name: "Dalarnas län", nuts: "SE312", places: ["dalarna", "falun", "borlänge", "ludvika", "avesta", "mora", "leksand", "hedemora", "rättvik"] },
  { id: "gavleborg", name: "Gävleborgs län", nuts: "SE313", places: ["gävleborg", "gävle", "sandviken", "hudiksvall", "bollnäs", "söderhamn", "ljusdal", "ockelbo"] },
  { id: "vasternorrland", name: "Västernorrlands län", nuts: "SE321", places: ["västernorrland", "sundsvall", "örnsköldsvik", "härnösand", "sollefteå", "kramfors", "timrå", "ånge"] },
  { id: "jamtland", name: "Jämtlands län", nuts: "SE322", places: ["jämtland", "härjedalen", "östersund", "krokom", "strömsund", "åre"] },
  { id: "vasterbotten", name: "Västerbottens län", nuts: "SE331", places: ["västerbotten", "umeå", "skellefteå", "lycksele", "vännäs", "vilhelmina", "storuman"] },
  { id: "norrbotten", name: "Norrbottens län", nuts: "SE332", places: ["norrbotten", "luleå", "piteå", "boden", "kiruna", "gällivare", "kalix", "haparanda", "älvsbyn"] },
];

export const ALL_COUNTIES = "alla";

export function getCounty(id: string): County | undefined {
  return COUNTIES.find((county) => county.id === id);
}

export type Notice = {
  id: string;
  title: string;
  description: string;
  buyer: string;
  city: string;
  /** Alla NUTS-/landskoder som annonsen anger som utförandeort */
  placeCodes: string[];
  posted: string;
  deadline: string;
  value: number;
  category: string;
  sourceUrl: string;
};

export type KeywordReason = {
  keyword: string;
  field: "titel" | "beskrivning";
  snippet: string;
};

export type CountyReason =
  | { status: "confirmed"; countyId: string; via: "utförandeort" | "ort" | "upphandlare"; detail: string }
  | { status: "unknown"; detail: string };

export type Hit = {
  notice: Notice;
  keywords: KeywordReason[];
  county: CountyReason;
};

const MIN_KEYWORD = 3;
const MAX_KEYWORD = 40;
const MAX_KEYWORDS = 8;

export type ParsedKeywords = { ok: true; keywords: string[] } | { ok: false; error: string };

/** Tolkar och validerar användarens sökord. Inget av det skickas vidare till TED. */
export function parseKeywords(raw: string): ParsedKeywords {
  const parts = raw
    .split(/[,;\n]/)
    .map((part) => part.trim().toLowerCase().replace(/\s+/g, " "))
    .filter(Boolean);
  const unique = [...new Set(parts)];
  if (unique.length === 0) return { ok: false, error: "Ange minst ett sökord." };
  if (unique.length > MAX_KEYWORDS) return { ok: false, error: `Ange högst ${MAX_KEYWORDS} sökord.` };
  for (const keyword of unique) {
    if (keyword.length < MIN_KEYWORD) {
      return { ok: false, error: `"${keyword}" är för kort – använd minst ${MIN_KEYWORD} tecken per sökord.` };
    }
    if (keyword.length > MAX_KEYWORD) return { ok: false, error: `Sökord får vara högst ${MAX_KEYWORD} tecken.` };
    if (!/^[\p{L}\p{N} \-&/]+$/u.test(keyword)) {
      return { ok: false, error: `"${keyword}" innehåller tecken som inte stöds.` };
    }
  }
  return { ok: true, keywords: unique };
}

function snippetAround(text: string, index: number, length: number): string {
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + length + 60);
  const body = text.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${body}${end < text.length ? "…" : ""}`;
}

/** Vilka sökord finns i annonsen, i vilket fält, och i vilket sammanhang. */
export function matchKeywords(notice: Notice, keywords: string[]): KeywordReason[] {
  const reasons: KeywordReason[] = [];
  const fields: Array<[KeywordReason["field"], string]> = [
    ["titel", notice.title],
    ["beskrivning", notice.description],
  ];
  for (const keyword of keywords) {
    for (const [field, text] of fields) {
      const index = text.toLowerCase().indexOf(keyword);
      if (index >= 0) {
        reasons.push({ keyword, field, snippet: snippetAround(text, index, keyword.length) });
        break; // ett skäl per sökord räcker; titel går före beskrivning
      }
    }
  }
  return reasons;
}

function hasWord(haystack: string, word: string): boolean {
  let from = 0;
  while (true) {
    const index = haystack.indexOf(word, from);
    if (index < 0) return false;
    const before = index === 0 ? "" : haystack[index - 1];
    // Ortnamn får följas av genitiv-s ("Malmö stad", "Lunds kommun") men inte stå mitt i ett annat ord.
    const after = haystack.slice(index + word.length).replace(/^s(?![\p{L}])/u, "");
    const beforeOk = !before || !/[\p{L}\p{N}]/u.test(before);
    const afterOk = !after || !/^[\p{L}\p{N}]/u.test(after);
    if (beforeOk && afterOk) return true;
    from = index + 1;
  }
}

function countyFromText(text: string): County | undefined {
  const hay = text.toLowerCase();
  if (!hay.trim()) return undefined;
  const found = COUNTIES.filter((county) => county.places.some((place) => hasWord(hay, place)));
  // Flera olika län i samma text = tvetydigt. Hellre "okänt" än en gissning.
  return found.length === 1 ? found[0] : undefined;
}

/** Avgör annonsens län: först utförandeort (NUTS), sedan ort, sist upphandlarens namn. */
export function resolveCounty(notice: Notice): CountyReason {
  const nuts3 = [...new Set(notice.placeCodes.filter((code) => /^SE\d{3}$/.test(code)))];
  const byNuts = nuts3.map((code) => COUNTIES.find((county) => county.nuts === code)).filter(Boolean) as County[];
  if (byNuts.length > 0) {
    return {
      status: "confirmed",
      countyId: byNuts[0].id,
      via: "utförandeort",
      detail: `Utförandeort ${byNuts.map((county) => `${county.name} (${county.nuts})`).join(", ")}`,
    };
  }
  const byCity = countyFromText(notice.city);
  if (byCity) return { status: "confirmed", countyId: byCity.id, via: "ort", detail: `Upphandlarens ort: ${notice.city}` };
  const byBuyer = countyFromText(notice.buyer);
  if (byBuyer) return { status: "confirmed", countyId: byBuyer.id, via: "upphandlare", detail: `Upphandlare: ${notice.buyer}` };
  return { status: "unknown", detail: "Annonsen anger inget län som går att avgöra säkert" };
}

/** Alla län som annonsen bekräftat rör (en annons kan ha flera utförandeorter). */
function confirmedCountyIds(notice: Notice, primary: CountyReason): string[] {
  const fromNuts = notice.placeCodes
    .map((code) => COUNTIES.find((county) => county.nuts === code)?.id)
    .filter(Boolean) as string[];
  if (fromNuts.length > 0) return [...new Set(fromNuts)];
  return primary.status === "confirmed" ? [primary.countyId] : [];
}

export type MatchResult = {
  /** Sökord träffar och länet är bekräftat (eller alla län valda) */
  hits: Hit[];
  /** Sökord träffar men länet går inte att avgöra – räknas inte i rubriken */
  unknownCounty: Hit[];
};

export function matchNotices(notices: Notice[], keywords: string[], countyId: string): MatchResult {
  const hits: Hit[] = [];
  const unknownCounty: Hit[] = [];
  for (const notice of notices) {
    const reasons = matchKeywords(notice, keywords);
    if (reasons.length === 0) continue;
    const county = resolveCounty(notice);
    if (countyId === ALL_COUNTIES) {
      hits.push({ notice, keywords: reasons, county });
      continue;
    }
    const ids = confirmedCountyIds(notice, county);
    if (ids.includes(countyId)) {
      const wanted = getCounty(countyId);
      const reason: CountyReason =
        county.status === "confirmed" && county.countyId !== countyId && wanted
          ? { status: "confirmed", countyId, via: "utförandeort", detail: `Utförandeort ${wanted.name} (${wanted.nuts})` }
          : county;
      hits.push({ notice, keywords: reasons, county: reason });
    } else if (ids.length === 0) {
      unknownCounty.push({ notice, keywords: reasons, county });
    }
  }
  const byNewest = (a: Hit, b: Hit) => b.notice.posted.localeCompare(a.notice.posted);
  return { hits: hits.sort(byNewest), unknownCounty: unknownCounty.sort(byNewest) };
}
