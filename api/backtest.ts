import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runBacktest } from "../server/backtest";
import { ALL_COUNTIES, getCounty, parseKeywords } from "../server/match";

function single(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** GET /api/backtest?ord=städ,lokalvård&lan=skane */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Endast GET stöds." });
    return;
  }

  const rawKeywords = single(req.query.ord);
  if (rawKeywords.length > 400) {
    res.status(400).json({ error: "För många sökord." });
    return;
  }
  const parsed = parseKeywords(rawKeywords);
  if (parsed.ok === false) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const county = single(req.query.lan) || ALL_COUNTIES;
  if (county !== ALL_COUNTIES && !getCounty(county)) {
    res.status(400).json({ error: "Okänt län." });
    return;
  }

  try {
    const result = await runBacktest(parsed.keywords, county);
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    res.status(200).json({ keywords: parsed.keywords, county, ...result });
  } catch (error) {
    // Inget påhittat resultat om TED inte svarar – sidan visar felet i stället.
    console.error("backtest", error);
    res.status(502).json({ error: "TED svarar inte just nu. Försök igen om en stund." });
  }
}
