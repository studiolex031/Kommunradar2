import { useQuery } from "@tanstack/react-query";
import { tenders as catalog, type Tender } from "@/data/demoData";

interface ApiResponse {
  source: "ted" | "unavailable";
  tenders: Tender[];
}

async function loadTenders(): Promise<Tender[]> {
  try {
    const response = await fetch("/api/tenders");
    if (!response.ok) return catalog;
    const payload = (await response.json()) as ApiResponse;
    if (!payload.tenders?.length) return catalog;
    const liveIds = new Set(payload.tenders.map((item) => item.id));
    return [...payload.tenders, ...catalog.filter((item) => !liveIds.has(item.id))];
  } catch {
    return catalog;
  }
}

export function useTenders() {
  return useQuery({
    queryKey: ["tenders"],
    queryFn: loadTenders,
    staleTime: 15 * 60 * 1000,
    initialData: catalog,
  });
}
