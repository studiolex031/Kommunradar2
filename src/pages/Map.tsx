import { useMemo, useState } from "react";
import { SwedenMap } from "@/components/SwedenMap";
import { TenderCard } from "@/components/TenderCard";
import { getMunicipality } from "@/data/demoData";
import { useTenders } from "@/hooks/useTenders";

const MapPage = () => {
  const { data: tenders = [] } = useTenders();
  const [selected, setSelected] = useState<string | null>(null);
  const city = selected ? getMunicipality(selected) : undefined;
  const matches = useMemo(
    () => (selected ? tenders.filter((tender) => tender.municipalityId === selected) : tenders.slice(0, 6)),
    [selected, tenders],
  );

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Sverigekarta</h1>
        <p className="mt-1 text-muted-foreground">
          {city ? `Upphandlingar i ${city.name}` : "Välj en kommun för att se aktuella uppdrag."}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SwedenMap tenders={tenders} onSelectMunicipality={setSelected} />
        </div>
        <div className="space-y-3 lg:col-span-2">
          {matches.map((tender) => (
            <TenderCard
              key={tender.id}
              tender={tender}
              municipalityName={getMunicipality(tender.municipalityId)?.name || "Sverige"}
              compact
            />
          ))}
          {matches.length === 0 && (
            <p className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              Inga uppdrag i den här kommunen i nuvarande urval.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
