/**
 * "Missade upphandlingar": hämtar de senaste 30 dagarnas svenska upphandlings-
 * annonser från TED och kör en prospekts sökord + län mot dem.
 *
 * Användarens sökord skickas aldrig till TED – frågan mot TED innehåller bara
 * land, annonstyp och datum. All matchning sker lokalt i server/match.ts.
 */
import { categoryFromCpv, pickNumber, pickString } from "./ted";
import { matchNotices, type Hit, type Notice } from "./match";

const TED_URL = "https://api.ted.europa.eu/v3/notices/search";
const PAGE_SIZE = 250;
const MAX_PAGES = 8; // 2 000 annonser – över det flaggas resultatet som ofullständigt
const WINDOW_DAYS = 30;
const CACHE_MS = 30 * 60 * 1000;
const TIMEOUT_MS = 9_000;

const BASE_FIELDS = [
  "publication-number",
  "notice-title",
  "buyer-name",
  "estimated-value",
  "deadline-receipt-tenders",
  "buyer-city",
  "classification-cpv",
  "description-proc",
  "publication-date",
  "links",
];

/**
 * Prövas i ordning tills TED svarar OK. Första varianten ger bäst underlag
 * (även stängda annonser, med utförandeort). De senare är reservlägen och
 * vilket som användes redovisas i svaret – aldrig tyst.
 */
const VARIANTS = [
  { scope: "ALL", placeField: true },
  { scope: "ALL", placeField: false },
  { scope: "ACTIVE", placeField: false },
] as const;

type Variant = (typeof VARIANTS)[number];

export type Window = {
  from: string;
  to: string;
  notices: Notice[];
  total: number;
  truncated: boolean;
  scope: Variant["scope"];
  hasPlaceOfPerformance: boolean;
};

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Samlar alla strängar i ett godtyckligt nästlat TED-fält. */
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value.trim().toUpperCase());
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
}

function toNotice(raw: Record<string, unknown>, index: number): Notice {
  const id = pickString(raw["publication-number"]) || `okänd-${index}`;
  const title = pickString(raw["notice-title"]) || "Upphandling utan titel";
  const links = raw.links as Record<string, unknown> | undefined;
  return {
    id,
    title,
    description: pickString(raw["description-proc"]),
    buyer: pickString(raw["buyer-name"]),
    city: pickString(raw["buyer-city"]),
    placeCodes: collectStrings(raw["place-of-performance"]),
    posted: pickString(raw["publication-date"]).slice(0, 10),
    deadline: pickString(raw["deadline-receipt-tenders"]).slice(0, 10),
    value: pickNumber(raw["estimated-value"]),
    category: categoryFromCpv(pickString(raw["classification-cpv"])),
    sourceUrl:
      pickString(links?.html) ||
      pickString(links?.pdf) ||
      `https://ted.europa.eu/sv/notice/-/detail/${encodeURIComponent(id)}`,
  };
}

type Page = { notices: Record<string, unknown>[]; total: number };

async function fetchPage(query: string, variant: Variant, page: number): Promise<Page> {
  const response = await fetch(TED_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      query,
      fields: variant.placeField ? [...BASE_FIELDS, "place-of-performance"] : BASE_FIELDS,
      page,
      limit: PAGE_SIZE,
      scope: variant.scope,
      paginationMode: "PAGE_NUMBER",
    }),
  });
  if (!response.ok) throw new Error(`TED ${response.status}`);
  const payload = (await response.json()) as { notices?: Record<string, unknown>[]; totalNoticeCount?: number };
  const notices = payload.notices ?? [];
  return { notices, total: typeof payload.totalNoticeCount === "number" ? payload.totalNoticeCount : notices.length };
}

async function fetchWindow(now: Date): Promise<Window> {
  const from = new Date(now.getTime() - WINDOW_DAYS * 86_400_000);
  const query = `buyer-country = SWE AND notice-type = cn-standard AND publication-date >= ${isoDay(from).replace(/-/g, "")}`;

  let lastError: unknown;
  for (const variant of VARIANTS) {
    try {
      const first = await fetchPage(query, variant, 1);
      const pageCount = Math.min(MAX_PAGES, Math.max(1, Math.ceil(first.total / PAGE_SIZE)));
      const rest = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, i) => fetchPage(query, variant, i + 2)),
      );
      const raw = [first, ...rest].flatMap((page) => page.notices);
      const seen = new Set<string>();
      const notices = raw.map(toNotice).filter((notice) => {
        if (seen.has(notice.id)) return false;
        seen.add(notice.id);
        return true;
      });
      return {
        from: isoDay(from),
        to: isoDay(now),
        notices,
        total: first.total,
        truncated: first.total > notices.length,
        scope: variant.scope,
        hasPlaceOfPerformance: variant.placeField,
      };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Kunde inte hämta TED");
}

let cache: { at: number; day: string; window: Promise<Window> } | undefined;

/** 30-dagarsfönstret hämtas högst en gång per halvtimme och varm instans. */
export function getWindow(now = new Date()): Promise<Window> {
  const day = isoDay(now);
  if (cache && cache.day === day && now.getTime() - cache.at < CACHE_MS) return cache.window;
  const window = fetchWindow(now);
  cache = { at: now.getTime(), day, window };
  window.catch(() => {
    if (cache?.window === window) cache = undefined; // cacha aldrig ett fel
  });
  return window;
}

export type BacktestHit = {
  id: string;
  title: string;
  buyer: string;
  category: string;
  posted: string;
  deadline: string;
  /** null = deadline saknas i annonsen */
  daysLeft: number | null;
  open: boolean;
  value: number;
  sourceUrl: string;
  keywords: Hit["keywords"];
  county: Hit["county"];
};

export type BacktestResult = {
  from: string;
  to: string;
  scanned: number;
  truncated: boolean;
  /** false = TED gav bara annonser som fortfarande är öppna */
  includesClosed: boolean;
  /** false = län avgörs enbart av ort och upphandlarens namn */
  usesPlaceOfPerformance: boolean;
  hits: BacktestHit[];
  unknownCounty: BacktestHit[];
};

const MAX_RETURNED = 100;

function present(hit: Hit, now: Date): BacktestHit {
  const { notice } = hit;
  const daysLeft = notice.deadline
    ? Math.ceil((new Date(`${notice.deadline}T23:59:59Z`).getTime() - now.getTime()) / 86_400_000)
    : null;
  return {
    id: notice.id,
    title: notice.title,
    buyer: notice.buyer,
    category: notice.category,
    posted: notice.posted,
    deadline: notice.deadline,
    daysLeft,
    open: daysLeft === null ? false : daysLeft >= 0,
    value: notice.value,
    sourceUrl: notice.sourceUrl,
    keywords: hit.keywords,
    county: hit.county,
  };
}

export async function runBacktest(keywords: string[], countyId: string, now = new Date()): Promise<BacktestResult> {
  const window = await getWindow(now);
  const { hits, unknownCounty } = matchNotices(window.notices, keywords, countyId);
  return {
    from: window.from,
    to: window.to,
    scanned: window.notices.length,
    truncated: window.truncated,
    includesClosed: window.scope === "ALL",
    usesPlaceOfPerformance: window.hasPlaceOfPerformance,
    hits: hits.slice(0, MAX_RETURNED).map((hit) => present(hit, now)),
    unknownCounty: unknownCounty.slice(0, MAX_RETURNED).map((hit) => present(hit, now)),
  };
}
