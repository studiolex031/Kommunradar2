import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import FilterPanel, { type FilterState } from "@/components/FilterPanel";
import { TenderCard } from "@/components/TenderCard";
import { getMunicipality } from "@/data/demoData";
import { useTenders } from "@/hooks/useTenders";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: tenders = [] } = useTenders();
  const municipalityId = searchParams.get("municipality") ?? "";
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    region: [],
    minValue: 0,
    status: ["open", "closing-soon"],
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const filteredTenders = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tenders.filter((tender) => {
      const municipality = getMunicipality(tender.municipalityId);
      const matchesQuery =
        !query ||
        tender.title.toLowerCase().includes(query) ||
        tender.summary.toLowerCase().includes(query) ||
        tender.keywords.some((keyword) => keyword.toLowerCase().includes(query)) ||
        municipality?.name.toLowerCase().includes(query);
      const matchesMunicipality = !municipalityId || tender.municipalityId === municipalityId;
      const matchesCategory = filters.category.length === 0 || filters.category.includes(tender.category);
      const matchesRegion = filters.region.length === 0 || filters.region.includes(municipality?.region || "");
      const matchesMinValue = tender.value >= filters.minValue;
      const matchesStatus = filters.status.length === 0 || filters.status.includes(tender.status);
      return matchesQuery && matchesMunicipality && matchesCategory && matchesRegion && matchesMinValue && matchesStatus;
    });
  }, [tenders, searchQuery, municipalityId, filters]);

  const updateQuery = (value: string) => {
    setSearchQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Kontraktsök</h1>
        <p className="mt-1 text-muted-foreground">Sök och filtrera upphandlingar från svenska kommuner.</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Sök titel, kommun eller nyckelord..."
            value={searchQuery}
            onChange={(event) => updateQuery(event.target.value)}
            className="h-11 pl-10"
          />
        </div>
        <Button variant="outline" className="h-11 gap-2" onClick={() => setFilterOpen(true)}>
          <SlidersHorizontal size={18} />
          Filter
        </Button>
        <div className="flex rounded-lg border border-border">
          <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="rounded-r-none" onClick={() => setViewMode("grid")}>
            <LayoutGrid size={18} />
          </Button>
          <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="rounded-l-none" onClick={() => setViewMode("list")}>
            <List size={18} />
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Visar <span className="font-semibold text-foreground">{filteredTenders.length}</span> upphandlingar
        </p>
        <div className="flex flex-wrap gap-2">
          {municipalityId && (
            <Badge variant="secondary" className="cursor-pointer text-xs" onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete("municipality");
              setSearchParams(next);
            }}>
              Kommun: {getMunicipality(municipalityId)?.name} ×
            </Badge>
          )}
          {filters.category.length > 0 && <Badge variant="secondary" className="text-xs">Kategori: {filters.category.length}</Badge>}
          {filters.region.length > 0 && <Badge variant="secondary" className="text-xs">Region: {filters.region.length}</Badge>}
        </div>
      </div>

      {filteredTenders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h3 className="text-lg font-semibold">Inga upphandlingar matchade</h3>
          <p className="mt-1 text-muted-foreground">Ändra sökord eller rensa filtren.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setFilters({ category: [], region: [], minValue: 0, status: ["open", "closing-soon"] });
              updateQuery("");
              setSearchParams({});
            }}
          >
            Rensa alla filter
          </Button>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-3"}>
          {filteredTenders.map((tender) => (
            <TenderCard
              key={tender.id}
              tender={tender}
              municipalityName={getMunicipality(tender.municipalityId)?.name || tender.buyer || "Sverige"}
              compact={viewMode === "list"}
            />
          ))}
        </div>
      )}

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} onFilterChange={setFilters} value={filters} />
    </div>
  );
};

export default SearchPage;
