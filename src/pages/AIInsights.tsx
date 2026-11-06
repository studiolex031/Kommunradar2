import { useState } from "react";
import { Sparkles, Brain, CheckCircle2, Loader2, Lightbulb, AlertCircle, TrendingUp, Zap, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIAnalysis } from "@/components/AIAnalysis";
import { tenders, municipalities } from "@/data/demoData";

interface AIInsight {
  id: string;
  title: string;
  description: string;
  priority: number;
  keywords: string[];
  type: "opportunity" | "risk" | "trend";
  icon: typeof Sparkles;
}

const AIInsights = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [insightsGenerated, setInsightsGenerated] = useState(false);

  const handleFullAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setInsightsGenerated(true);
    }, 2000);
  };

  const insights: AIInsight[] = [
    {
      id: "1",
      title: "Högkonjunktur i IT-sektorn",
      description: "AI:n identifierar en 34% ökning av IT-upphandlingar jämfört med förra kvartalet. Stockholm och Göteborg dominerar med 67% av alla digitala upphandlingar.",
      priority: 9,
      keywords: ["IT", "digitalisering", "trend", "Stockholm"],
      type: "trend",
      icon: TrendingUp,
    },
    {
      id: "2",
      title: "Snarastående deadlines",
      description: "8 upphandlingar stänger inom 7 dagar. 3 av dessa har en matchningsgrad över 85% för leverantörer inom bygg- och IT-sektorn.",
      priority: 8,
      keywords: ["deadline", "bygg", "IT", "prioritet"],
      type: "risk",
      icon: AlertCircle,
    },
    {
      id: "3",
      title: "Nyckeltrend: Hållbarhet",
      description: "Mark & Miljö-upphandlingar har ökat med 28% och fokus ligger på koldioxidneutralitet och cirkulär ekonomi. Solceller och energieffektivisering är hetaste kategorierna.",
      priority: 7,
      keywords: ["hållbarhet", "solceller", "energi", "miljö"],
      type: "opportunity",
      icon: Lightbulb,
    },
    {
      id: "4",
      title: "Lågkonjunktur i utbildningssektorn",
      description: "Utbildningsupphandlingar har minskat med 12%. Detta kan bero på att kommunerna väntar på budgetfastställelse. Föreslår att fokusera på andra kategorier under Q2.",
      priority: 5,
      keywords: ["utbildning", "budget", "trend"],
      type: "risk",
      icon: AlertCircle,
    },
    {
      id: "5",
      title: "Stor potential i Skåne",
      description: "Skåne har 19 aktiva upphandlingar med ett totalt värde på 290 mnkr. Malmö och Helsingborg driver tillväxt med fokus på smarta städer och infrastruktur.",
      priority: 8,
      keywords: ["Skåne", "Malmö", "infrastruktur", "smart city"],
      type: "opportunity",
      icon: Zap,
    },
    {
      id: "6",
      title: "AI-analys: Rekommendationer",
      description: "Baserat på din profil rekommenderar AI:n att du prioriterar 3 specifika upphandlingar med hög matchningsgrad och rimlig deadline. Dessa har genomsnittligt värde på 24 mnkr.",
      priority: 9,
      keywords: ["rekommendation", "matchning", "AI"],
      type: "opportunity",
      icon: Brain,
    },
  ];

  const typeColors = {
    opportunity: "bg-emerald-100 text-emerald-700",
    risk: "bg-red-100 text-red-700",
    trend: "bg-sky-100 text-sky-700",
  };

  const typeLabels = {
    opportunity: "Möjlighet",
    risk: "Risk",
    trend: "Trend",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">AI-insikter</h1>
            <p className="mt-1 text-muted-foreground">
              Automatisk analys och rekommendationer baserat på marknadsdata
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={handleFullAnalysis}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyserar marknaden...
              </>
            ) : insightsGenerated ? (
              <>
                <CheckCircle2 size={18} />
                Analys klar
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Kör fullständig analys
              </>
            )}
          </Button>
        </div>

        {/* AI Summary Card */}
        <Card className="mb-6 border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-sky-200">
                <Brain size={20} />
              </div>
              <div>
                <CardTitle className="text-base">AI:s sammanfattning</CardTitle>
                <p className="text-xs text-slate-500">Senaste analysen: {insightsGenerated ? "Just nu" : "Väntar på start"}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {insightsGenerated ? (
              <div className="animate-fade-in space-y-3">
                <p className="text-sm leading-relaxed text-slate-700">
                  Marknaden för svenska kommunupphandlingar är stark denna period med {tenders.filter(t => t.status === 'open').length} öppna upphandlingar värda över {(tenders.reduce((acc, t) => acc + t.value, 0) / 1_000_000).toFixed(0)} mnkr. IT- och byggsektorn dominerar med tillsammans 67% av totalvolymen. Skåne och Stockholm är de mest aktiva regionerna. AI:n rekommenderar att fokusera på upphandlingar med deadline inom 30 dagar för maximal chans.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white/80 p-3">
                    <p className="text-xs font-semibold text-emerald-700">Starkaste segmentet</p>
                    <p className="mt-1 text-sm font-medium">IT & Digitalisering</p>
                    <p className="text-xs text-muted-foreground">38 upphandlingar</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3">
                    <p className="text-xs font-semibold text-amber-700">Snabbast växande</p>
                    <p className="mt-1 text-sm font-medium">Mark & Miljö</p>
                    <p className="text-xs text-muted-foreground">+28% i kvartalet</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3">
                    <p className="text-xs font-semibold text-primary">Störst potential</p>
                    <p className="mt-1 text-sm font-medium">Skåne-regionen</p>
                    <p className="text-xs text-muted-foreground">290 mnkr totalt</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Klicka för att köra analys</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  AI:n kommer att analysera alla aktuella upphandlingar, identifiera trender, risker och affärsmöjligheter baserat på dina bevakningsprofiler.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insights Grid */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">Genererade insikter</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <Card
                  key={insight.id}
                  className="overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon size={18} />
                      </div>
                      <Badge className={typeColors[insight.type]}>
                        {typeLabels[insight.type]}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-base">{insight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {insight.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {insight.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${insight.priority * 10}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-primary">
                          {insight.priority * 10}% matchning
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                        Analysera <ArrowRight size={12} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* AI Analysis Cards */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">AI-analys av utvalda upphandlingar</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tenders.slice(0, 4).map((tender) => {
              const municipality = municipalities.find(
                (m) => m.id === tender.municipalityId
              );
              return (
                <AIAnalysis
                  key={tender.id}
                  summary={tender.summary}
                  keywords={tender.keywords}
                  priority={tender.priority}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
