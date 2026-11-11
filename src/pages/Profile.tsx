import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, History, LogOut, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACCOUNT_KEY, PROFILE_KEY, useAccount, useProfile } from "@/hooks/useAccount";
import { emptyProfile, fetchAccount, isSyncableId, logout, saveProfile, type AccountProfile } from "@/lib/account";
import { getSavedIds } from "@/lib/storage";
import { ALL_COUNTIES, COUNTIES, parseKeywords } from "../../server/match";

const UPGRADE_URL = "https://kommunradar.online/#pris";

const ProfilePage = () => {
  const { account, loading } = useAccount();
  const { data: profile, isPending: profileLoading, error: profileError } = useProfile(account !== null);
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [county, setCounty] = useState(ALL_COUNTIES);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");
  const [planBusy, setPlanBusy] = useState(false);
  const [planNote, setPlanNote] = useState("");

  // Fyll formuläret när profilen har hämtats (eller är tom för ett nytt konto).
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  useEffect(() => {
    if (!account || profile === undefined || loadedFor === account.email) return;
    const source = profile ?? emptyProfile;
    setName(source.name);
    setCompany(source.company);
    setKeywordInput(source.keywords.join(", "));
    setCounty(source.county);
    setLoadedFor(account.email);
  }, [account, profile, loadedFor]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl space-y-3 px-4 py-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="container mx-auto max-w-md px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Min profil</h1>
        <p className="mt-1 text-muted-foreground">
          Logga in för att spara dina sökord, ditt län och dina sparade upphandlingar på ett konto.
        </p>
        <Button asChild className="mt-6 h-11 gap-2">
          <Link to="/login">
            Logga in eller skapa konto <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    );
  }

  const savedKeywords = profile?.keywords ?? [];
  const missedLink =
    savedKeywords.length > 0
      ? `/missade?${new URLSearchParams({ ord: savedKeywords.join(","), lan: profile?.county ?? ALL_COUNTIES }).toString()}`
      : null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    let keywords: string[] = [];
    if (keywordInput.trim() !== "") {
      const parsed = parseKeywords(keywordInput);
      if (parsed.ok === false) {
        setError(parsed.error);
        return;
      }
      keywords = parsed.keywords;
    }
    if (name.trim().length > 120 || company.trim().length > 160) {
      setError("Namn eller företag är för långt.");
      return;
    }
    const next: AccountProfile = {
      name: name.trim(),
      company: company.trim(),
      keywords,
      county,
      saved: getSavedIds().filter(isSyncableId).slice(0, 500),
    };
    setStatus("saving");
    try {
      const stored = await saveProfile(next);
      queryClient.setQueryData(PROFILE_KEY, stored);
      setKeywordInput(stored.keywords.join(", "));
      setStatus("saved");
    } catch (problem) {
      setStatus("idle");
      setError(problem instanceof Error ? problem.message : "Profilen kunde inte sparas.");
    }
  };

  const refreshPlan = async () => {
    setPlanBusy(true);
    setPlanNote("");
    try {
      const fresh = await fetchAccount(true);
      queryClient.setQueryData(ACCOUNT_KEY, fresh);
      if (fresh?.plan === "pro") setPlanNote("Pro är aktivt på ditt konto.");
      else if (fresh && !fresh.planVerified) setPlanNote("Betalstatus kunde inte kontrolleras just nu.");
      else setPlanNote("Vi hittar ingen aktiv prenumeration på den här e-postadressen.");
    } catch {
      setPlanNote("Betalstatus kunde inte kontrolleras just nu.");
    } finally {
      setPlanBusy(false);
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } finally {
      queryClient.setQueryData(ACCOUNT_KEY, null);
      queryClient.removeQueries({ queryKey: PROFILE_KEY });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Min profil</h1>
        <p className="mt-1 break-all text-muted-foreground">Inloggad som {account.email}</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
              Abonnemang
              <Badge variant={account.plan === "pro" ? "default" : "secondary"}>
                {account.plan === "pro" ? "Pro" : "Gratis"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {account.plan === "pro" ? (
              <p className="text-muted-foreground">Din prenumeration är aktiv. Tack för att du använder Kommunradar.</p>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Pro låses upp automatiskt när betalningen är gjord med samma e-postadress som du loggar in med.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild className="gap-2">
                    <a href={UPGRADE_URL} target="_blank" rel="noopener noreferrer">
                      Se Pro och priser <ArrowRight size={16} />
                    </a>
                  </Button>
                  <Button type="button" variant="outline" className="gap-2" disabled={planBusy} onClick={refreshPlan}>
                    <RefreshCw size={16} className={planBusy ? "animate-spin" : ""} />
                    Jag har betalat – kontrollera
                  </Button>
                </div>
              </>
            )}
            {planNote && (
              <p className="text-muted-foreground" aria-live="polite">
                {planNote}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Uppgifter och bevakning</CardTitle>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <Skeleton className="h-56 w-full" />
            ) : profileError ? (
              <p role="alert" className="text-sm text-destructive">
                Profilen kunde inte hämtas. Ladda om sidan och försök igen.
              </p>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-name">Namn</Label>
                    <Input id="profile-name" value={name} maxLength={120} autoComplete="name" onChange={(event) => { setName(event.target.value); setStatus("idle"); }} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-company">Företag</Label>
                    <Input id="profile-company" value={company} maxLength={160} autoComplete="organization" onChange={(event) => { setCompany(event.target.value); setStatus("idle"); }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="profile-keywords">Sökord (kommaseparerade, högst 8)</Label>
                  <Input
                    id="profile-keywords"
                    value={keywordInput}
                    autoComplete="off"
                    placeholder="t.ex. lokalvård, städtjänster, fönsterputs"
                    onChange={(event) => { setKeywordInput(event.target.value); setStatus("idle"); }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="profile-county">Län</Label>
                  <Select value={county} onValueChange={(value) => { setCounty(value); setStatus("idle"); }}>
                    <SelectTrigger id="profile-county">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_COUNTIES}>Hela Sverige</SelectItem>
                      {COUNTIES.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Button type="submit" className="h-11 w-full gap-2 sm:w-auto" disabled={status === "saving"}>
                  {status === "saved" ? <Check size={18} /> : <Save size={18} />}
                  {status === "saving" ? "Sparar…" : status === "saved" ? "Sparat" : "Spara profil"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Sökord, län och dina sparade upphandlingar lagras på kontot och följer med när du loggar in på en annan
                  enhet.
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        {missedLink && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Vad har du missat de senaste 30 dagarna?</p>
                <p className="text-sm text-muted-foreground">Kör dina sparade sökord mot upphandlingarna på TED.</p>
              </div>
              <Button asChild variant="outline" className="gap-2">
                <Link to={missedLink}>
                  <History size={16} /> Visa missade uppdrag
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <Button type="button" variant="ghost" className="gap-2 text-muted-foreground" onClick={signOut}>
          <LogOut size={16} /> Logga ut
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
