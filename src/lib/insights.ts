import { tenders as fallback, type Tender, getMunicipality } from "@/data/demoData";
import { daysUntil, formatMoney } from "@/lib/format";

export function buildInsights(items: Tender[] = fallback) {
  const open = items.filter((item) => item.status !== "closed");
  const closing = items.filter((item) => item.status === "closing-soon");
  const byCategory = new Map<string, Tender[]>();
  const byRegion = new Map<string, Tender[]>();

  for (const item of items) {
    byCategory.set(item.category, [...(byCategory.get(item.category) ?? []), item]);
    const region = getMunicipality(item.municipalityId)?.region ?? "Övriga Sverige";
    byRegion.set(region, [...(byRegion.get(region) ?? []), item]);
  }

  const topCategory = [...byCategory.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  const topRegion = [...byRegion.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);
  const urgent = [...closing].sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline)).slice(0, 3);

  return {
    summary: `Just nu finns ${open.length} öppna uppdrag värda ${formatMoney(totalValue)}. ${
      topCategory ? `${topCategory[0]} är största kategorin med ${topCategory[1].length} uppdrag.` : ""
    } ${closing.length} stänger inom sju dagar.`,
    topCategory: topCategory?.[0] ?? "—",
    topCategoryCount: topCategory?.[1].length ?? 0,
    topRegion: topRegion?.[0] ?? "—",
    topRegionCount: topRegion?.[1].length ?? 0,
    closingCount: closing.length,
    urgent,
    cards: [
      {
        id: "trend",
        type: "trend" as const,
        title: `${topCategory?.[0] ?? "Marknaden"} leder volymen`,
        description: topCategory
          ? `${topCategory[0]} står för ${topCategory[1].length} av ${items.length} uppdrag (${formatMoney(
              topCategory[1].reduce((sum, item) => sum + (item.value || 0), 0),
            )}).`
          : "För få data för trend.",
        keywords: [topCategory?.[0] ?? "marknad"],
        priority: 8,
      },
      {
        id: "risk",
        type: "risk" as const,
        title: `${closing.length} uppdrag stänger snart`,
        description:
          closing.length > 0
            ? `Prioritera ${urgent.map((item) => item.title).join("; ") || "de närmaste deadlinerna"}.`
            : "Inga akuta deadlines i nuvarande urval.",
        keywords: ["deadline", "prioritet"],
        priority: 9,
      },
      {
        id: "geo",
        type: "opportunity" as const,
        title: `Starkast just nu: ${topRegion?.[0] ?? "Sverige"}`,
        description: topRegion
          ? `${topRegion[0]} har ${topRegion[1].length} uppdrag. Använd kartan för att filtrera på kommun.`
          : "Ingen regiondata.",
        keywords: [topRegion?.[0] ?? "Sverige"],
        priority: 7,
      },
    ],
  };
}
