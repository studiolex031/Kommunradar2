export type TedTender = {
  id: string;
  title: string;
  municipalityId: string;
  municipalityName: string;
  region: string;
  category: string;
  value: number;
  deadline: string;
  posted: string;
  status: "open" | "closing-soon" | "closed";
  description: string;
  summary: string;
  keywords: string[];
  priority: number;
  sourceUrl: string;
  buyer: string;
  source: "ted";
};

const TED_URL = "https://api.ted.europa.eu/v3/notices/search";

const CITY_MAP: Record<string, { id: string; name: string; region: string }> = {
  stockholm: { id: "stockholm", name: "Stockholm", region: "Stockholm" },
  gothenburg: { id: "gothenburg", name: "Göteborg", region: "Västra Götaland" },
  göteborg: { id: "gothenburg", name: "Göteborg", region: "Västra Götaland" },
  malmö: { id: "malmo", name: "Malmö", region: "Skåne" },
  malmo: { id: "malmo", name: "Malmö", region: "Skåne" },
  uppsala: { id: "uppsala", name: "Uppsala", region: "Uppsala" },
  västerås: { id: "vasteras", name: "Västerås", region: "Västmanland" },
  örebro: { id: "orebro", name: "Örebro", region: "Örebro" },
  linköping: { id: "linkoping", name: "Linköping", region: "Östergötland" },
  helsingborg: { id: "helsingborg", name: "Helsingborg", region: "Skåne" },
  jönköping: { id: "jonkoping", name: "Jönköping", region: "Jönköpings län" },
  umeå: { id: "umea", name: "Umeå", region: "Västerbotten" },
  luleå: { id: "lulea", name: "Luleå", region: "Norrbotten" },
  lund: { id: "lund", name: "Lund", region: "Skåne" },
  karlstad: { id: "karlstad", name: "Karlstad", region: "Värmland" },
  gävle: { id: "gavle", name: "Gävle", region: "Gävleborg" },
  sundsvall: { id: "sundsvall", name: "Sundsvall", region: "Västernorrland" },
  visby: { id: "visby", name: "Region Gotland", region: "Gotland" },
  kalmar: { id: "kalmar", name: "Kalmar", region: "Kalmar län" },
};

export function pickString(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return pickString(value[0]);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return pickString(record.swe ?? record.eng ?? record.sv ?? record.en ?? Object.values(record)[0]);
  }
  return "";
}

export function pickNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return pickNumber(record.amount ?? record.value ?? Object.values(record)[0]);
  }
  return 0;
}

export function categoryFromCpv(cpv: string): string {
  const code = cpv.slice(0, 2);
  if (["48", "72", "30", "32", "64"].includes(code)) return "IT & Digitalisering";
  if (["45", "71", "44"].includes(code)) return "Bygg & Fastighet";
  if (["90", "77", "03", "14"].includes(code)) return "Mark & Miljö";
  if (["85", "33"].includes(code)) return "Hälsa & Omsorg";
  if (["80"].includes(code)) return "Utbildning";
  return "Övrigt";
}

function resolvePlace(city: string, buyer: string) {
  const hay = `${city} ${buyer}`.toLowerCase();
  for (const [key, value] of Object.entries(CITY_MAP)) {
    if (hay.includes(key)) return value;
  }
  return { id: "sweden", name: city || "Sverige", region: "Övriga Sverige" };
}

function statusFromDeadline(deadline: string): TedTender["status"] {
  if (!deadline) return "open";
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "closed";
  if (days <= 7) return "closing-soon";
  return "open";
}

export async function fetchTedTenders(): Promise<TedTender[]> {
  const response = await fetch(TED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: "buyer-country = SWE AND notice-type = cn-standard",
      fields: [
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
      ],
      page: 1,
      limit: 40,
      scope: "ACTIVE",
      paginationMode: "PAGE_NUMBER",
    }),
  });

  if (!response.ok) {
    throw new Error(`TED ${response.status}`);
  }

  const payload = (await response.json()) as { notices?: Record<string, unknown>[] };
  const notices = payload.notices ?? [];

  return notices.map((notice, index) => {
    const id = pickString(notice["publication-number"]) || `ted-${index}`;
    const title = pickString(notice["notice-title"]) || "Upphandling utan titel";
    const buyer = pickString(notice["buyer-name"]) || "Offentlig upphandlare";
    const city = pickString(notice["buyer-city"]);
    const place = resolvePlace(city, buyer);
    const cpv = pickString(notice["classification-cpv"]);
    const description =
      pickString(notice["description-proc"]) ||
      `${title}. Upphandlande myndighet: ${buyer}.`;
    const posted = pickString(notice["publication-date"]).slice(0, 10);
    const deadline = pickString(notice["deadline-receipt-tenders"]).slice(0, 10);
    const links = notice.links as Record<string, unknown> | undefined;
    const sourceUrl =
      pickString(links?.html) ||
      pickString(links?.pdf) ||
      `https://ted.europa.eu/en/notice/-/detail/${encodeURIComponent(id)}`;

    return {
      id: `ted-${id}`,
      title,
      municipalityId: place.id,
      municipalityName: place.name,
      region: place.region,
      category: categoryFromCpv(cpv),
      value: pickNumber(notice["estimated-value"]),
      deadline: deadline || posted,
      posted,
      status: statusFromDeadline(deadline),
      description,
      summary: description.slice(0, 280),
      keywords: [place.name, categoryFromCpv(cpv), "TED", "LOU"].filter(Boolean),
      priority: 7,
      sourceUrl,
      buyer,
      source: "ted",
    };
  });
}
