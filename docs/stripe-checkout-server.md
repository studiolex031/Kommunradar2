# Kommunradar server-side Stripe Checkout

## Status

This endpoint is an isolated implementation draft. It is **not deployed**, has not created any Stripe Checkout Sessions, and is not connected to the public `kommunradar.online` site.

The Vercel project currently linked to `studiolex031/Kommunradar2` is `projectkr`. Its Vercel project record has no verified `kommunradar.online` domain and no environment variables. Do not treat a preview deployment as the production checkout.

## API contract

`POST /api/checkout`

Request JSON:

```json
{
  "bevakningsord": "markarbete",
  "lan": "Västra Götaland",
  "checkoutRequestId": "a valid UUID generated once per checkout attempt"
}
```

Success response:

```json
{
  "checkoutUrl": "https://checkout.stripe.com/...",
  "sessionId": "cs_..."
}
```

The browser must navigate to `checkoutUrl`. Never call Stripe directly from the browser and never send a Stripe secret to the client.

## Stripe behavior retained

The endpoint creates a hosted Checkout Session using a server-configured, fixed recurring Price ID. Before creating a session, it retrieves that Price from Stripe and refuses to proceed unless it is active, SEK 99000 minor units (990 SEK), monthly, tax-exclusive, and in the same test/live mode as the configured secret key:

- Subscription mode.
- One Pro monthly recurring line item.
- Seven-day trial; trial-end behavior when no payment method exists remains `create_invoice`, matching the current Payment Link.
- Payment method collected at signup; Stripe's account-level dynamic payment-method selection is retained, matching the current Payment Link.
- Billing address required.
- Promotion codes enabled; promotional email consent remains disabled, matching the current Payment Link.
- Terms of service acceptance required (Stripe account must have a valid terms URL configured).
- Tax ID collection enabled but optional.
- Swedish Checkout locale.
- Bevakningsord and region are mapped to the existing digest schema and copied to both Checkout Session and Subscription metadata: `keywords` contains the entered search terms; `lan` contains the canonical key expected by `digest.py` (for example `vastragotaland`, or `alla`). This lets the existing daily digest discover active/trialing subscriptions directly from Stripe without a separate customer database.
- The client cannot choose a Price ID, amount, currency, trial length, success URL, or cancel URL.

The current live monthly Pro Price read from Stripe was `price_1UWuJMC7YfJBxRnAPVVy2dLT` (990 SEK/month). The endpoint intentionally does not hard-code this live ID: configure the matching Price ID separately for test and production environments. Never pair a live Price ID with a test secret key or vice versa.

## Required Vercel environment variables

Configure only after confirming the correct Vercel project and deployment target:

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe secret key; encrypted/sensitive in Vercel. Use `sk_test_...` for preview and `sk_live_...` only for approved production. |
| `STRIPE_PRICE_ID` | Fixed monthly Pro Price ID for the same Stripe mode as the key. |
| `STRIPE_SUCCESS_URL` | Existing, verified success page URL; include `?session_id={CHECKOUT_SESSION_ID}` if the page will retrieve the session server-side. |
| `STRIPE_CANCEL_URL` | Existing, verified pricing/cancel page URL. |
| `PUBLIC_SITE_URL` | Canonical site origin, e.g. `https://kommunradar.online`. |
| `CHECKOUT_ALLOWED_ORIGINS` | Optional comma-separated exact origins if more than `PUBLIC_SITE_URL` is required. |

Do not add production values until the actual production Vercel project and domain are verified. The repo-linked `projectkr` project currently has no env vars and no custom domain.

## Frontend integration

After the endpoint is deployed to the actual production origin, the existing search/preview form should call it with the values already entered by the customer:

```ts
const response = await fetch("https://YOUR_VERIFIED_API_ORIGIN/api/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    bevakningsord,
    lan,
    checkoutRequestId: crypto.randomUUID(),
  }),
});

const result = await response.json();
if (!response.ok) throw new Error(result.error ?? "Kassan kunde inte startas.");
window.location.assign(result.checkoutUrl);
```

Replace `YOUR_VERIFIED_API_ORIGIN` only after deployment and domain verification. Do not leave the static Payment Link as a second active route from the same form; route all Pro CTAs consistently after the new endpoint has passed acceptance tests.

## Security and operational notes

- Exact-origin CORS allowlist; POST and OPTIONS only.
- Strict field validation and a county/region allowlist matching the public site's region values, plus the 'Hela Sverige' option.
- Client cannot set price, quantity, trial, Stripe mode, redirect URLs, or metadata keys outside the server's fixed schema.
- Stripe secret is read only from server environment variables.
- Stripe error bodies and submitted search terms are not written to logs or returned to the browser.
- A valid UUID is required from the client for each checkout attempt; Stripe's idempotency key is derived from that UUID. Generate a new UUID when the customer changes the search or starts a new attempt.
- Success and cancel URLs must use HTTPS and an origin in the configured allowlist.
- A small in-memory per-IP request limiter is included as a best-effort guard. It is not a distributed rate limiter and must not be treated as strong abuse protection across serverless instances.
- This endpoint only creates Checkout Sessions. The current email-digest workflow reads active/trialing subscriptions and their metadata directly from Stripe, so a webhook is not required for that existing email delivery path. If a separate gated web product is later introduced, access must be provisioned and revoked from verified Stripe subscription lifecycle events, never from the success redirect alone.
- No live Stripe setting, Payment Link, price, customer, subscription, payment, production domain, environment variable, or deployment was changed by this implementation.

## Acceptance tests before production

1. Preview uses a Stripe test secret and a test-mode Price ID.
2. Valid Swedish search values create a test Checkout Session and redirect to Stripe.
3. Stripe shows 0 SEK today, card/payment method collection, required billing address and terms, then 990 SEK/month after seven days.
4. Checkout Session and Subscription metadata contain `keywords` with the entered search phrase and `lan` with the canonical key used by `digest.py`; the daily digest recognizes the subscription and selects the correct region.
5. Invalid län, blank/oversized search term, wrong origin, missing config, non-POST, and repeated rate-limited requests fail safely.
6. Cancel returns to the verified pricing page.
7. The success page is not used as proof of payment. Verify that the existing digest reads the resulting active/trialing Stripe subscription and metadata; if a separate gated product is used, test its signed webhook flow independently.
8. Only after all tests pass should the owner approve production env configuration, domain routing, and deployment.
