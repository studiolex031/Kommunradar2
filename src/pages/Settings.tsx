import { useState } from "react";
import {
  User,
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  Save,
  RotateCcw,
  Shield,
  Globe,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weekly: true,
    daily: false,
    instant: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Inställningar</h1>
          <p className="mt-1 text-muted-foreground">
            Hantera din profil, bevakningar och aviseringspreferenser
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <User size={18} />
                  </div>
                  <CardTitle className="text-base">Profilinformation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Förnamn</Label>
                    <Input id="firstName" defaultValue="Anders" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Efternamn</Label>
                    <Input id="lastName" defaultValue="Bergström" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-postadress</Label>
                  <Input id="email" type="email" defaultValue="hej@kommunradar.online" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" defaultValue="+46 70 123 45 67" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Företag</Label>
                    <Input id="company" defaultValue="ByggPartner AB" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Roll</Label>
                  <Select defaultValue="procurement-manager">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="procurement-manager">Upphandlingsansvarig</SelectItem>
                      <SelectItem value="sales">Försäljare</SelectItem>
                      <SelectItem value="project-manager">Projektledare</SelectItem>
                      <SelectItem value="business-dev">Business Development</SelectItem>
                      <SelectItem value="analyst">Analytiker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Anteckningar</Label>
                  <Textarea id="notes" rows={3} placeholder="Lägg till personliga anteckningar..." />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Bell size={18} />
                  </div>
                  <CardTitle className="text-base">Aviseringar</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Kanaler</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">E-post</p>
                          <p className="text-xs text-muted-foreground">Aviseringar via e-post</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(v) => setNotifications((p) => ({ ...p, email: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div className="flex items-center gap-3">
                        <Smartphone size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Push-aviseringar</p>
                          <p className="text-xs text-muted-foreground">Mobilnotiser i realtid</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(v) => setNotifications((p) => ({ ...p, push: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div className="flex items-center gap-3">
                        <Bell size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">SMS</p>
                          <p className="text-xs text-muted-foreground">Korta meddelanden via SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(v) => setNotifications((p) => ({ ...p, sms: v }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-3 text-sm font-semibold">Frekvens</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div>
                        <p className="text-sm font-medium">Omedelbara aviseringar</p>
                        <p className="text-xs text-muted-foreground">När nya upphandlingar matchar din profil</p>
                      </div>
                      <Switch
                        checked={notifications.instant}
                        onCheckedChange={(v) => setNotifications((p) => ({ ...p, instant: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div>
                        <p className="text-sm font-medium">Dags sammanfattning</p>
                        <p className="text-xs text-muted-foreground">E-post varje klocka 08:00</p>
                      </div>
                      <Switch
                        checked={notifications.daily}
                        onCheckedChange={(v) => setNotifications((p) => ({ ...p, daily: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div>
                        <p className="text-sm font-medium">Veckovisa rapporter</p>
                        <p className="text-xs text-muted-foreground">Marknadsanalys varje måndag</p>
                      </div>
                      <Switch
                        checked={notifications.weekly}
                        onCheckedChange={(v) => setNotifications((p) => ({ ...p, weekly: v }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Globe size={18} />
                  </div>
                  <CardTitle className="text-base">Preferenser</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Språk</Label>
                    <Select defaultValue="sv">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sv">Svenska</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Valuta</Label>
                    <Select defaultValue="sek">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sek">SEK (SEK)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Tidszon</Label>
                    <Select defaultValue="cet">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cet">Europe/Stockholm (CET)</SelectItem>
                        <SelectItem value="gmt">GMT</SelectItem>
                        <SelectItem value="est">EST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Datumformat</Label>
                    <Select defaultValue="yyyy-mm-dd">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yyyy-mm-dd">ÅÅÅÅ-MM-DD</SelectItem>
                        <SelectItem value="dd-mm-yyyy">DD-MM-ÅÅÅÅ</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultRegion">Standardregion</Label>
                  <Select defaultValue="stockholm">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stockholm">Stockholm</SelectItem>
                      <SelectItem value="gothenburg">Göteborg</SelectItem>
                      <SelectItem value="malmo">Malmö</SelectItem>
                      <SelectItem value="all">Hela Sverige</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Security */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Shield size={18} />
                  </div>
                  <CardTitle className="text-base">Säkerhet</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Shield size={16} />
                  Ändra lösenord
                  <ChevronRight size={14} />
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <LockIcon />
                  Tvåfaktorsautentisering
                  <ChevronRight size={14} />
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Clock size={16} />
                  Aktivitetslogg
                  <ChevronRight size={14} />
                </Button>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <MapPin size={18} />
                  </div>
                  <CardTitle className="text-base">Plats</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Stockholm, Sverige</p>
                    <p className="text-xs text-muted-foreground">Sist uppdaterad: idag</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              className="w-full gap-2"
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? (
                <>
                  <CheckCircle2 size={18} />
                  Sparat!
                </>
              ) : (
                <>
                  <Save size={18} />
                  Spara ändringar
                </>
              )}
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <RotateCcw size={16} />
              Återställ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default Settings;
