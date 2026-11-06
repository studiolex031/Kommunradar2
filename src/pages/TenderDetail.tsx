import { Link, useParams } from "react-router-dom";
import { Bookmark, CheckCircle2, FileText, Globe, MapPin, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getMunicipality, statusLabels } from "@/data/demoData";
import { daysUntil, formatDate, formatMoney } from "@/lib/format";
import { useSavedTenders } from "@/hooks/useSavedTenders";
import { useTenders } from "@/hooks/useTenders";
import { toast } from "sonner";

const TenderDetail = () => {
  const { id } = useParams();
  const { data: tenders = [] } = useTenders();
  const tender = tenders.find((item) => item.id === id);
  const { has, toggle } = useSavedTenders();

  if (!tender) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Upphandlingen hittades inte</h1>
        <Button className="mt-4" asChild>
          <Link to="/search">Tillbaka till kontraktsök</Link>
        </Button>
      </div>
    );
  }

  const municipality = getMunicipality(tender.municipalityId);
  const related = tenders.filter((item) => item.id !== tender.id && item.category === tender.category).slice(0, 3);
  const remaining = daysUntil(tender.deadline);
  const saved = has(tender.id);
  const sourceUrl = tender.sourceUrl || `https://ted.europa.eu/en/search/result?query=${encodeURIComponent(tender.title)}`;

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: tender.title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Länk kopierad");
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Översikt</Link>
        <span>/</span>
        <Link to="/search" className="hover:text-foreground">Kontraktsök</Link>
        <span>/</span>
        <span className="truncate text-foreground">{tender.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText size={24} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={tender.status === "open" ? "bg-emerald-100 text-emerald-700" : tender.status === "closing-soon" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}>
                    {statusLabels[tender.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{tender.category}</span>
                </div>
                <h1 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">{tender.title}</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => toggle(tender.id)} className={saved ? "text-amber-500" : ""}>
                <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
              </Button>
              <Button variant="outline" size="icon" onClick={share}>
                <Share2 size={18} />
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Värde</p>
              <p className="mt-1 text-lg font-bold">{formatMoney(tender.value)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Sista anbudsdag</p>
              <p className="mt-1 text-lg font-bold">{formatDate(tender.deadline)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Tid kvar</p>
              <p className="mt-1 text-lg font-bold text-amber-600">{remaining < 0 ? "Stängd" : `${remaining} dagar`}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Prioritet</p>
              <p className="mt-1 text-lg font-bold text-primary">{tender.priority}/10</p>
            </div>
          </div>

          <Separator className="my-6" />

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Översikt</TabsTrigger>
              <TabsTrigger value="details">Detaljer</TabsTrigger>
              <TabsTrigger value="contact">Kontakt</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{tender.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {tender.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary">{keyword}</Badge>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Publicerad</span><span>{formatDate(tender.posted)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Förfarande</span><span>Öppen anbudsgivning enligt LOU</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Källa</span><span>{tender.source === "ted" ? "TED Europa" : "Kommunradar-katalog"}</span></div>
            </TabsContent>
            <TabsContent value="contact" className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">{municipality?.name || tender.buyer}</p>
                  <p className="text-xs text-muted-foreground">{municipality?.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User size={18} className="text-primary" />
                <p className="text-sm">{tender.buyer || "Upphandlingsenheten"}</p>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-primary" />
                <a className="text-sm text-primary hover:underline" href={sourceUrl} target="_blank" rel="noreferrer">
                  Öppna källa
                </a>
              </div>
              <Button className="w-full" asChild>
                <a href={sourceUrl} target="_blank" rel="noreferrer">Gå till originalannons</a>
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Bedömning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                {remaining > 0
                  ? `Det finns ${remaining} dagar kvar. Kontrollera kravspecifikation, referenser och kapacitet innan anbud.`
                  : "Anbudstiden har gått ut. Använd uppdraget som referens för liknande kommande kontrakt."}
              </p>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />
                <span>Matcha mot era bevakningsprofiler under Bevakningar.</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Liknande uppdrag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {related.map((item) => (
                <Link key={item.id} to={`/tender/${item.id}`} className="block rounded-lg border p-3 hover:border-primary/40">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatMoney(item.value)}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full" onClick={() => toggle(tender.id)}>
            {saved ? "Ta bort från bevakning" : "Spara i bevakning"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenderDetail;
