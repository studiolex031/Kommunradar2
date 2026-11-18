import type { VercelRequest, VercelResponse } from "@vercel/node";

const STRIPE_API = "https://api.stripe.com/v1/checkout/sessions";
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 10;
const requestsByIp = new Map<string, number[]>();

const ALLOWED_COUNTIES = new Set([
  "Hela Sverige",
  "Blekinge", "Dalarna", "Gotland", "Gävleborg", "Halland", "Jämtland",
  "Jönköping", "Kalmar", "Kronoberg", "Norrbotten", "Skåne", "Stockholm",
  "Södermanland", "Uppsala", "Värmland", "Västerbotten", "Västernorrland",
  "Västmanland", "Västra Götaland", "Örebro", "Östergötland",
]);

function getAllowedOrigins(): Set<string> {
  const configured = process.env.CHECKOUT_ALLOWED_ORIGINS
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean) ?? [];
  const siteUrl = process.env.PUBLIC_SITE_URL;
  if (siteUrl) configured.push(siteUrl);

  return new Set(configured.map((value) => {
    try {
      return new URL(value).origin;
    } catch {
      return "";
    }
  }).filter(Boolean));
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestsByIp.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    requestsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  requestsByIp.set(ip, recent);
  return false;
}

function sendJson(res: VercelResponse, status: number, payload: Record<string, unknown>) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(payload);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();

  res.setHeader("Vary", "Origin");
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "600");
  }

  if (req.method === "OPTIONS") {
    if (!origin || !allowedOrigins.has(origin)) {
      return sendJson(res, 403, { error: "Origin tillåts inte." });
    }
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendJson(res, 405, { error: "Metoden stöds inte." });
  }

  if (!origin || !allowedOrigins.has(origin)) {
    return sendJson(res, 403, { error: "Origin tillåts inte." });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const successUrl = process.env.STRIPE_SUCCESS_URL;
  const cancelUrl = process.env.STRIPE_CANCEL_URL;

  if (!secretKey || !priceId || !successUrl || !cancelUrl) {
    return sendJson(res, 503, { error: "Checkout är inte konfigurerad ännu." });
  }

  if (!/^sk_(test|live)_[A-Za-z0-9]+$/.test(secretKey) || !/^price_[A-Za-z0-9]+$/.test(priceId)) {
    return sendJson(res, 503, { error: "Checkout-konfigurationen är ogiltig." });
  }

  const redirectUrls = [successUrl, cancelUrl].map((value) => {
    try {
      return new URL(value);
    } catch {
      return null;
    }
  });
  if (
    redirectUrls.some((url) =>
      !url ||
      url.protocol !== "https:" ||
      !allowedOrigins.has(url.origin) ||
      Boolean(url.username || url.password)
    )
  ) {
    return sendJson(res, 503, { error: "Checkoutens returadresser är inte godkända." });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return sendJson(res, 429, { error: "För många försök. Vänta en minut och försök igen." });
  }

  const body = req.body && typeof req.body === "object" ? req.body as Record<string, unknown> : {};
  const bevakningsord = typeof body.bevakningsord === "string" ? body.bevakningsord.trim() : "";
  const lan = typeof body.lan === "string" ? body.lan.trim() : "";
  const requestId = typeof body.checkoutRequestId === "string" ? body.checkoutRequestId : "";

  if (!bevakningsord || bevakningsord.length > 120 || /[<>\u0000-\u001F]/.test(bevakningsord)) {
    return sendJson(res, 400, { error: "Ange ett bevakningsord på högst 120 tecken." });
  }

  if (!ALLOWED_COUNTIES.has(lan)) {
    return sendJson(res, 400, { error: "Välj ett giltigt svenskt län." });
  }

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
    return sendJson(res, 400, { error: "Checkoutförsöket saknar ett giltigt ID. Försök igen." });
  }
  const idempotencyId = requestId;

  const form = new URLSearchParams();
  form.set("mode", "subscription");
  form.set("ui_mode", "hosted_page");
  form.set("line_items[0][price]", priceId);
  form.set("line_items[0][quantity]", "1");
  form.set("payment_method_collection", "always");
  form.set("billing_address_collection", "required");
  form.set("consent_collection[terms_of_service]", "required");
  form.set("tax_id_collection[enabled]", "true");
  form.set("tax_id_collection[required]", "never");
  form.set("locale", "sv");
  form.set("submit_type", "subscribe");
  form.set("success_url", successUrl);
  form.set("cancel_url", cancelUrl);
  form.set("client_reference_id", idempotencyId);
  form.set("metadata[plan]", "kommunradar_pro_monthly");
  form.set("metadata[bevakningsord]", bevakningsord);
  form.set("metadata[lan]", lan);
  form.set("subscription_data[trial_period_days]", "7");
  form.set("subscription_data[metadata][plan]", "kommunradar_pro_monthly");
  form.set("subscription_data[metadata][bevakningsord]", bevakningsord);
  form.set("subscription_data[metadata][lan]", lan);

  try {
    // Verify the server-configured Price before creating a session. This prevents
    // an accidental wrong-mode, inactive, or incorrectly priced plan from charging.
    const priceResponse = await fetch(`https://api.stripe.com/v1/prices/${priceId}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    if (!priceResponse.ok) {
      return sendJson(res, 503, { error: "Den valda abonnemangsplanen kunde inte verifieras." });
    }
    const price = await priceResponse.json() as {
      active?: boolean;
      currency?: string;
      unit_amount?: number | null;
      livemode?: boolean;
      recurring?: { interval?: string; interval_count?: number } | null;
    };
    const keyIsLive = secretKey.startsWith("sk_live_");
    if (
      price.active !== true ||
      price.currency !== "sek" ||
      price.unit_amount !== 99000 ||
      price.livemode !== keyIsLive ||
      price.recurring?.interval !== "month" ||
      (price.recurring?.interval_count ?? 1) !== 1
    ) {
      return sendJson(res, 503, { error: "Abonnemangsplanen matchar inte Kommunradars godkända pris." });
    }

    const stripeResponse = await fetch(STRIPE_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": `kommunradar-checkout-${idempotencyId}`,
      },
      body: form.toString(),
    });

    const stripePayload = await stripeResponse.json() as {
      id?: string;
      url?: string | null;
    };

    if (!stripeResponse.ok || !stripePayload.url) {
      // Never return Stripe's raw error body or customer input to the browser.
      return sendJson(res, 502, { error: "Stripe kunde inte starta kassan. Försök igen senare." });
    }

    return sendJson(res, 200, {
      checkoutUrl: stripePayload.url,
      sessionId: stripePayload.id,
    });
  } catch {
    return sendJson(res, 502, { error: "Kassan kunde inte nås just nu. Försök igen senare." });
  }
}
