import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, BellOff, Clock3, Filter, Plus, Search, Trash2, TrendingUp, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { municipalities, tenders, categories, regions } from "@/data/demoData";

interface WatchProfile {
  id: string;
  name: string;
  categories: string[];
  regions: string[];
  minValue: number;
  keywords: string[];
  active: boolean;
  lastNotified: string;
  matchCount: number;
}

const Watchlist = () => {
  const [profiles, setProfiles] = useState<WatchProfile[]>([
    {
      id: "wp1",
      name: "IT & Digitalisering - Stockholm",
      categories: ["IT & Digitalisering"],
      regions: ["Stockholm"],
      minValue: 5000000,
      keywords: ["digitalisering", "plattform", "AI"],
      active: true,
      lastNotified: "2025-04-20",
      matchCount: 12,
    },
    {
      id: "wp2",
      name: "Bygg & Fastighet - Skåne",
      categories: ["Bygg & Fastighet"],
      regions: ["Skåne"],
      minValue: 10000000,
      keywords: ["bygg", "renovering", "fastighet"],
      active: true,
      lastNotified: "2025-04-18",
      matchCount: 8,
    },
    {
      id: "wp3",
      name: "Mark & Miljö - Övriga",
      categories: ["Mark & Miljö"],
      regions: ["Övriga Sverige"],
      minValue: 3000000,
      keywords: ["miljö", "hållbarhet", "grön"],
      active: false,
      lastNotified: "2025-04-10",
      matchCount: 5,
    },
  ]);

  const [savedTenders, setSavedTenders] = useState(tenders.slice(0, 5));
  const [newProfileOpen, setNewProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleProfile = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      )
    );
  };

  const deleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredSavedTenders = savedTenders.filter((tender) =>
    !searchQuery ||
    tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Bevakningar</h1>
          <p className="mt-1 text-muted-foreground">
            Hantera dina bevakningsprofiler och sparade upphandlingar
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Watch Profiles */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bevakningsprofiler</h2>
              <Dialog open={newProfileOpen} onOpenChange={setNewProfileOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus size={16} />
                    Ny profil
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Skapa ny bevakningsprofil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileName">Profilnamn</Label>
                      <Input id="profileName" placeholder="t.ex. IT-upphandlingar Stockholm" />
                    </div>
                    <div className="space-y-2">
                      <Label>Kategorier</Label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <Badge key={cat} variant="outline" className="cursor-pointer">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Regioner</Label>
                      <div className="flex flex-wrap gap-2">
                        {regions.map((reg) => (
                          <Badge key={reg} variant="outline" className="cursor-pointer">
                            {reg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minValue">Minsta upphandlingsvärde</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Välj värde" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Alla</SelectItem>
                          <SelectItem value="5000000">5 mnkr</SelectItem>
                          <SelectItem value="10000000">10 mnkr</SelectItem>
                          <SelectItem value="20000000">20 mnkr</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Nyckelord</Label>
                      <Textarea id="keywords" placeholder="Ange nyckelord separerade med kommatecken" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="active">Aktivera bevakning</Label>
                      <Switch id="active" defaultChecked />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setNewProfileOpen(false)}>
                        Avbryt
                      </Button>
                      <Button>Spara profil</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {profiles.map((profile) => (
                <Card key={profile.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          profile.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {profile.active ? <Bell size={18} /> : <BellOff size={18} />}
                      </div>
                      <div>
                        <CardTitle className="text-base">{profile.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          Senast uppdaterad: {profile.lastNotified}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={profile.active}
                        onCheckedChange={() => toggleProfile(profile.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteProfile(profile.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Kategorier</p>
                        <p className="font-medium">{profile.categories.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Regioner</p>
                        <p className="font-medium">{profile.regions.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Minsta värde</p>
                        <p className="font-medium">{(profile.minValue / 1_000_000).toFixed(0)} mnkr</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Matchningar</p>
                        <p className="font-medium text-primary">{profile.matchCount} upphandlingar</p>
                      </div>
                    </div>
                    {profile.keywords.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-1.5 text-xs text-muted-foreground">Nyckelord</p>
                        <div className="flex flex-wrap gap-1">
                          {profile.keywords.map((kw) => (
                            <Badge key={kw} variant="secondary" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Saved Tenders */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Sparade upphandlingar</h2>
            </div>
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Sök bland sparade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-10"
                />
              </div>
            </div>
            <div className="space-y-3">
              {filteredSavedTenders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BellOff size={40} className="mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Inga sparade upphandlingar</p>
                </div>
              ) : (
                filteredSavedTenders.map((tender) => (
                  <div
                    key={tender.id}
                    className="group rounded-xl border border-border p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Bell size={14} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium leading-snug">{tender.title}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {municipalities.find((m) => m.id === tender.municipalityId)?.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => setSavedTenders((prev) => prev.filter((t) => t.id !== tender.id))}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-semibold">
                        {(tender.value / 1_000_000).toFixed(0)} mnkr
                      </span>
                      <Link to={`/tender/${tender.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                          Visa <ArrowRight size={12} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
