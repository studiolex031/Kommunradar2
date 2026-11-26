import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarClock, Check, ExternalLink, Link2, MapPin, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatMoney } from "@/lib/format";
import { ALL_COUNTIES, COUNTIES, getCounty, parseKeywords } from "../../server/match";
import type { BacktestHit, BacktestResult } from "../../server/backtest";

type ApiResult = BacktestResult & { keywords: string[]; county: string };

const SIGNUP_URL = "https://kommunradar.online";

async function loadBacktest(keywords: string, county: string): Promise<ApiResult> {
  const params = new URLSearchParams({ ord: keywords, lan: county });
  const response = await fetch(`/api/backtest?${params.toString()}`);
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload) {
    throw new Error(payload?.error ?? "Kunde inte hämta upphandlingarna. Försök igen om en stund.");
  }
  return payload as ApiResult;
}

function deadlineLabel(hit: BacktestHit): { text: string; tone: "open" | "closed" | "unknown" } {
  if (hit.daysLeft === null) return { text: "Sista anbudsdag ej angiven", tone: "unknown" };
  if (hit.daysLeft < 0) return { text: `Stängde ${formatDate(hit.deadline)}`, tone: "closed" };
  if (hit.daysLeft === 0) return { text: "Stänger i dag", tone: "open" };
  return { text: `Öppen – ${hit.daysLeft} ${hit.daysLeft === 1 ? "dag" : "dagar"} kvar`, tone: "open" };
}

const HitCard = ({ hit }: { hit: BacktestHit }) => {
  const deadline = deadlineLabel(hit);
  return (
    <Card>
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={deadline.tone === "open" ? "default" : "secondary"} className="gap-1">
            <CalendarClock size={12} />
            {deadline.text}
          </Badge>
          <Badge variant="outline">{hit.category}</Badge>
          {hit.value > 0 && <Badge variant="outline">{formatMoney(hit.value)}</Badge>}
        </div>

        <div>
          <h3 className="text-base font-semibold leading-snug">{hit.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {hit.buyer || "Upphandlare ej angiven"} · publicerad {formatDate(hit.posted)}
          </p>
        </div>

        <div className="rounded-lg bg-muted/60 p-3 text-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Därför matchade den</p>
          <ul className="space-y-1.5">
            {hit.keywords.map((reason) => (
              <li key={reason.keyword} className="flex gap-2">
                <Tag size={14} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  <span className="font-medium">”{reason.keyword}”</span> i {reason.field}:{" "}
                  <span className="text-muted-foreground">{reason.snippet}</span>
                </span>
              </li>
            ))}
            <li className="flex gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
              <span>{hit.county.detail}</span>
            </li>
          </ul>
        </div>

        <a
          href={hit.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Visa annonsen på TED <ExternalLink size={14} />
        </a>
      </CardContent>
    </Card>
  );
};

const MissedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeKeywords = searchParams.get("ord") ?? "";
  const activeCounty = searchParams.get("lan") ?? ALL_COUNTIES;

  const [keywordInput, setKeywordInput] = useState(activeKeywords);
  const [countyInput, setCountyInput] = useState(getCounty(activeCounty) ? activeCounty : ALL_COUNTIES);
  const [formError, setFormError] = useState("");
  const [copied, setCopied] = useState(false);

  const { data, error, isFetching } = useQuery({
    queryKey: ["backtest", activeKeywords, activeCounty],
    queryFn: () => loadBacktest(activeKeywords, activeCounty),
    enabled: activeKeywords.length > 0,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsed = parseKeywords(keywordInput);
    if (parsed.ok === false) {
      setFormError(parsed.error);
      return;
    }
    setFormError("");
    setCopied(false);
    setSearchParams({ ord: parsed.keywords.join(","), lan: countyInput });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const countyName = getCounty(activeCounty)?.name ?? "hela Sverige";
  const openHits = data?.hits.filter((hit) => hit.open) ?? [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Vad har du missat?</h1>
        <p className="mt-1 text-muted-foreground">
          Ange dina sökord och ditt län. Vi går igenom de senaste 30 dagarnas offentliga upphandlingar från TED och
          visar vilka som hade landat i din inkorg.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 sm:p-5">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="missed-keywords">Sökord (kommaseparerade)</Label>
              <Input
                id="missed-keywords"
                value={keywordInput}
                onChange={(event) => setKeywordInput(event.target.value)}
                placeholder="t.ex. lokalvård, städtjänster, fönsterputs"
                className="h-11"
                autoComplete="off"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="missed-county">Län</Label>
              <Select value={countyInput} onValueChange={setCountyInput}>
                <SelectTrigger id="missed-county" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_COUNTIES}>Hela Sverige</SelectItem>
                  {COUNTIES.map((county) => (
                    <SelectItem key={county.id} value={county.id}>
                      {county.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="h-11 gap-2" disabled={isFetching}>
              <Search size={18} />
              Visa vad jag missat
            </Button>
          </form>
          {formError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {formError}
            </p>
          )}
        </CardContent>
      </Card>

      {isFetching && (
        <div className="space-y-3" aria-live="polite" aria-busy="true">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {!isFetching && error && (
        <Card>
          <CardContent className="p-5">
            <p role="alert" className="font-medium text-destructive">
              {error instanceof Error ? error.message : "Något gick fel."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Inga siffror visas förrän TED har svarat.</p>
          </CardContent>
        </Card>
      )}

      {!isFetching && !error && data && (
        <div className="space-y-6">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="text-3xl font-bold sm:text-4xl">
                  {data.hits.length} {data.hits.length === 1 ? "upphandling" : "upphandlingar"}
                </p>
                <p className="mt-1 text-muted-foreground">
                  matchade {data.keywords.map((keyword) => `”${keyword}”`).join(", ")} i {countyName} mellan{" "}
                  {formatDate(data.from)} och {formatDate(data.to)}.
                  {openHits.length > 0 && (
                    <span className="font-medium text-foreground">
                      {" "}
                      {openHits.length} av dem går fortfarande att lämna anbud på.
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button asChild className="h-auto min-h-10 gap-2 whitespace-normal py-2 text-center">
                  <a href={SIGNUP_URL} target="_blank" rel="noopener noreferrer">
                    Få nästa träff samma dag – 7 dagar gratis <ArrowRight size={16} />
                  </a>
                </Button>
                <Button type="button" variant="outline" className="gap-2" onClick={copyLink}>
                  {copied ? <Check size={16} /> : <Link2 size={16} />}
                  {copied ? "Länk kopierad" : "Kopiera länk till resultatet"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Underlag: {data.scanned} svenska upphandlingsannonser på TED
                {data.truncated ? " (fler finns – resultatet är inte heltäckande)" : ""}.
                {!data.includesClosed && " TED gav bara annonser som fortfarande är öppna, så redan stängda saknas."}
                {!data.usesPlaceOfPerformance &&
                  activeCounty !== ALL_COUNTIES &&
                  " Län avgjordes av upphandlarens ort och namn, inte av angiven utförandeort."}
              </p>
            </CardContent>
          </Card>

          {data.hits.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Inga annonser matchade i perioden. Pröva bredare sökord eller välj hela Sverige.
            </p>
          ) : (
            <div className="space-y-3">
              {data.hits.map((hit) => (
                <HitCard key={hit.id} hit={hit} />
              ))}
            </div>
          )}

          {data.unknownCounty.length > 0 && (
            <section className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold">Matchade sökorden – län ej angivet</h2>
                <p className="text-sm text-muted-foreground">
                  {data.unknownCounty.length === 1
                    ? "1 annons innehåller dina sökord men anger"
                    : `${data.unknownCounty.length} annonser innehåller dina sökord men anger`}{" "}
                  inget län som går att avgöra säkert. {data.unknownCounty.length === 1 ? "Den räknas" : "De räknas"} inte
                  i siffran ovan.
                </p>
              </div>
              {data.unknownCounty.map((hit) => (
                <HitCard key={hit.id} hit={hit} />
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default MissedPage;
