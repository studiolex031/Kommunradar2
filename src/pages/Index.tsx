import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsOverview } from "@/components/StatsOverview";
import { SwedenMap } from "@/components/SwedenMap";
import { TenderCard } from "@/components/TenderCard";
import { municipalities, computeAnalytics, getMunicipality } from "@/data/demoData";
import { formatMoney } from "@/lib/format";
import { buildInsights } from "@/lib/insights";
import { useTenders } from "@/hooks/useTenders";

const Index = () => {
  const { data: tenders = [] } = useTenders();
  const analytics = computeAnalytics(tenders);
  const insights = buildInsights(tenders);
  const recentTenders = [...tenders]
    .sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime())
    .slice(0, 6);
  const featuredTenders = [...tenders].sort((a, b) => b.priority - a.priority).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <section className="mb-8">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-sky-50 via-blue-50 to-slate-50 p-6 sm:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles size={14} />
                Kommunradar och kontraktsök
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Hitta affärer i <span className="text-primary">offentliga upphandlingar</span>
              </h1>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Bevaka svenska kommuner, filtrera uppdrag och spara de kontrakt som matchar er verksamhet.
                Katalogdata ingår alltid. Live-notiser från TED kopplas på när API:t är tillgängligt.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/search">
                    Öppna kontraktsök <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/map">Visa kartan</Link>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-2xl font-bold text-primary">{analytics.openTenders}</p>
                  <p className="text-muted-foreground">Öppna uppdrag</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{municipalities.length}</p>
                  <p className="text-muted-foreground">Kommuner</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">{formatMoney(analytics.totalValue)}</p>
                  <p className="text-muted-foreground">Volym i urvalet</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-border bg-white/80 p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Senast publicerade</h3>
                  <Badge variant="secondary" className="text-[10px]">Uppdateras lokalt</Badge>
                </div>
                <div className="mt-3 space-y-3">
                  {recentTenders.slice(0, 3).map((tender) => (
                    <Link key={tender.id} to={`/tender/${tender.id}`} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 hover:bg-slate-100">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Eye size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-snug">{tender.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {getMunicipality(tender.municipalityId)?.name} • {formatMoney(tender.value)}
                        </p>
                      </div>
                      <Clock3 size={14} className="text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Översikt</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/analytics">Visa analyser <ArrowRight size={14} /></Link>
          </Button>
        </div>
        <StatsOverview analytics={analytics} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Sverigekarta</h2>
            <Badge variant="secondary" className="text-xs">Klicka på en kommun</Badge>
          </div>
          <SwedenMap tenders={tenders} />
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold">Insikter</h2>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm leading-relaxed text-slate-700">
            {insights.summary}
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Utvalda möjligheter</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/search">Visa alla <ArrowRight size={14} /></Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTenders.map((tender) => (
            <TenderCard
              key={tender.id}
              tender={tender}
              municipalityName={getMunicipality(tender.municipalityId)?.name || tender.buyer || "Sverige"}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
