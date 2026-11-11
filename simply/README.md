# login.kommunradar.online på Simply

Här ligger allt som behövs för att köra Kommunradar-appen på ett vanligt
webbhotell (PHP + MySQL) i stället för Vercel.

## Vad paketet innehåller

| Del | Vad den gör |
| --- | --- |
| Appen (byggd från `src/`) | Samma React-app som tidigare, plus sidorna `/login`, `/profil` och `/missade` |
| `api/tenders.php`, `api/backtest.php` | Hämtar upphandlingar från TED (samma logik som `server/*.ts`) |
| `api/auth-request.php`, `api/auth-verify.php`, `api/me.php`, `api/logout.php` | Inloggning med e-post + engångskod |
| `api/profile.php` | Sparar namn, företag, sökord, län och sparade upphandlingar på kontot |
| `api/_lib/` | Delad kod och inställningar (spärrad för besökare) |
| `api/_data/` | Cache och hemlig nyckel (spärrad för besökare, måste vara skrivbar) |

## Krav på webbhotellet

- PHP 8.1 eller nyare med tilläggen `pdo_mysql`, `curl` och `mbstring`
- Apache med `.htaccess` och `mod_rewrite`
- En MySQL-databas
- HTTPS påslaget för underdomänen

## Bygga paketet

```bash
npm install
bash scripts/build-simply.sh
```

Resultatet hamnar i `release/login.kommunradar.online.zip`.

## Lägga upp det

1. Skapa underdomänen `login.kommunradar.online` i Simplys kontrollpanel och slå på HTTPS för den.
2. Skapa en MySQL-databas (eller använd en befintlig – tabellerna heter `kr_...`).
3. Packa upp zip-filen och ladda upp **innehållet** i mappen `login.kommunradar.online/` till underdomänens webbmapp. Filen `.htaccess` måste följa med (den är dold i vissa filhanterare).
4. Kopiera `api/_lib/config.sample.php` till `api/_lib/config.php` på servern och fyll i databasuppgifterna.
5. Se till att mappen `api/_data/` är skrivbar för PHP.
6. Öppna `https://login.kommunradar.online/api/me` – svaret ska vara `{"account":null}`. Tabellerna skapas automatiskt vid det första anropet.
7. Logga in med din egen e-postadress på `/login` och kontrollera att koden kommer fram.

## Pro via Stripe (valfritt)

Lägg en begränsad Stripe-nyckel (`rk_live_...`) med läsrätt till Customers och
Subscriptions i `stripe_secret_key`. Ett konto visas då som Pro när samma
e-postadress har en prenumeration med status `active` eller `trialing`.
Statusen cachas i en timme. Utan nyckel visas alla konton som Gratis.

## Säkerhet i korthet

- Koden är 6 siffror, gäller i 10 minuter, får prövas högst 5 gånger och kan bara användas en gång.
- Högst en kod per minut och fem per timme och adress, 20 per timme och IP-adress.
- Koder och sessionsnycklar sparas bara som hashar. Sessionskakan är `HttpOnly` och `SameSite=Lax`.
- Anrop som ändrar något kräver headern `X-Kommunradar: 1` och rätt `Origin`.
- `config.php` och innehållet i `api/_data/` ska aldrig läggas i Git.

## Testa lokalt

```bash
bash scripts/build-simply.sh
# lägg en config.php med t.ex. 'db_dsn' => 'sqlite:/tmp/kr.sqlite' och 'mail_transport' => 'log'
php -S 127.0.0.1:8090 -t release/login.kommunradar.online simply/dev-router.php
```
