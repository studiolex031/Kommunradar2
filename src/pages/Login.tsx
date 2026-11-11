import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ACCOUNT_KEY, useAccount } from "@/hooks/useAccount";
import { requestLoginCode, verifyLoginCode } from "@/lib/account";

const LoginPage = () => {
  const { account, loading } = useAccount();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  if (!loading && account) return <Navigate to="/profil" replace />;

  const sendCode = async (event?: FormEvent) => {
    event?.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await requestLoginCode(email.trim());
      setStep("code");
      setCode("");
      setNotice(`Vi har skickat en sexsiffrig kod till ${email.trim()}. Den gäller i 10 minuter.`);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Något gick fel.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const signedIn = await verifyLoginCode(email.trim(), code);
      queryClient.setQueryData(ACCOUNT_KEY, signedIn);
      navigate("/profil", { replace: true });
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Något gick fel.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Logga in eller skapa konto</h1>
      <p className="mt-1 text-muted-foreground">
        Ange din e-postadress så mejlar vi en engångskod. Inget lösenord behövs, och kontot skapas första gången du
        loggar in.
      </p>

      <Card className="mt-6">
        <CardContent className="p-5">
          {step === "email" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">E-postadress</Label>
                <Input
                  id="login-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="namn@foretag.se"
                  className="h-11"
                />
              </div>
              <Button type="submit" className="h-11 w-full gap-2" disabled={busy || email.trim() === ""}>
                <Mail size={18} />
                {busy ? "Skickar…" : "Skicka kod"}
              </Button>
            </form>
          ) : (
            <form onSubmit={verify} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-code">Kod från mejlet</Label>
                <Input
                  id="login-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9 ]*"
                  maxLength={7}
                  required
                  autoFocus
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  placeholder="123456"
                  className="h-12 text-center text-xl tracking-[0.4em]"
                />
              </div>
              <Button type="submit" className="h-11 w-full gap-2" disabled={busy || code.length !== 6}>
                <KeyRound size={18} />
                {busy ? "Kontrollerar…" : "Logga in"}
              </Button>
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setStep("email");
                    setError("");
                    setNotice("");
                  }}
                >
                  <ArrowLeft size={14} /> Byt e-postadress
                </button>
                <button type="button" className="font-medium text-primary hover:underline" disabled={busy} onClick={() => sendCode()}>
                  Skicka ny kod
                </button>
              </div>
            </form>
          )}

          {notice && !error && (
            <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
              {notice}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Vill du bara titta runt?{" "}
        <Link to="/" className="font-medium text-primary hover:underline">
          Fortsätt utan konto
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
