import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchTedTenders } from "../server/ted";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const tenders = await fetchTedTenders();
    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");
    res.status(200).json({ source: "ted", tenders });
  } catch (error) {
    res.status(200).json({
      source: "unavailable",
      tenders: [],
      error: error instanceof Error ? error.message : "Kunde inte hämta TED",
    });
  }
}
