import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, TrendingUp, AlertCircle } from "lucide-react";
import { municipalities, type Tender } from "@/data/demoData";
import { formatMoney } from "@/lib/format";

interface SwedenMapProps {
  tenders: Tender[];
  onSelectMunicipality?: (id: string) => void;
}

export const SwedenMap = ({ tenders, onSelectMunicipality }: SwedenMapProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, { count: number; value: number }>();
    for (const tender of tenders) {
      const current = map.get(tender.municipalityId) ?? { count: 0, value: 0 };
      current.count += 1;
      current.value += tender.value || 0;
      map.set(tender.municipalityId, current);
    }
    return map;
  }, [tenders]);

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelectMunicipality?.(id);
  };

  const selectedCity = municipalities.find((municipality) => municipality.id === selected);
  const hoveredCity = municipalities.find((municipality) => municipality.id === hovered);
  const selectedStats = selected ? counts.get(selected) : undefined;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-slate-50 to-sky-50/50">
      <div className="absolute left-4 top-4 z-10 rounded-xl bg-card/90 px-3 py-2 shadow-sm backdrop-blur-sm">
        <p className="text-xs font-medium">Sverigekarta</p>
        <p className="mt-1 text-[11px] text-muted-foreground">Klicka på en kommun</p>
      </div>

      <div className="relative mx-auto h-[460px] w-full max-w-[640px]">
        <svg viewBox="0 0 600 700" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <path
            d="M 310 20 L 330 35 L 345 55 L 350 80 L 365 95 L 375 120 L 385 145 L 395 170 L 390 195 L 400 220 L 410 245 L 415 270 L 420 295 L 425 320 L 430 345 L 425 370 L 415 395 L 405 420 L 395 445 L 385 470 L 375 495 L 365 520 L 355 545 L 345 570 L 335 595 L 325 620 L 315 645 L 305 670 L 295 690 L 285 695 L 280 685 L 285 660 L 290 635 L 295 610 L 300 585 L 305 560 L 310 535 L 315 510 L 320 485 L 325 460 L 330 435 L 335 410 L 340 385 L 345 360 L 350 335 L 355 310 L 360 285 L 365 260 L 370 235 L 375 210 L 380 185 L 385 160 L 390 135 L 395 110 L 400 85 L 405 60 L 410 40 L 415 25 Z"
            fill="hsl(var(--background))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />
          <path d="M 480 480 L 500 490 L 510 505 L 505 525 L 485 530 L 470 515 L 472 495 Z" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="2" />
          <path d="M 430 465 L 440 470 L 442 495 L 435 515 L 425 505 L 425 480 Z" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="2" />
        </svg>

        {municipalities.map((municipality) => {
          const count = counts.get(municipality.id)?.count ?? 0;
          return (
            <button
              key={municipality.id}
              onMouseEnter={() => setHovered(municipality.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleSelect(municipality.id)}
              className={`municipality-dot absolute flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white shadow-sm ${
                count > 0 ? "bg-primary hover:bg-sky-600" : "bg-slate-300 hover:bg-slate-400"
              } ${selected === municipality.id ? "active bg-sky-600" : ""}`}
              style={{ left: `${Math.min(92, Math.max(8, municipality.x))}%`, top: `${Math.min(92, Math.max(6, municipality.y))}%` }}
              aria-label={`Välj ${municipality.name}`}
            >
              {count > 0 && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </button>
          );
        })}

        {hoveredCity && (
          <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-xl bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
            <p className="font-semibold">{hoveredCity.name}</p>
            <p className="mt-0.5 text-slate-300">{counts.get(hovered)?.count ?? 0} upphandlingar</p>
          </div>
        )}
      </div>

      {selectedCity && (
        <div className="absolute bottom-4 left-4 right-4 z-10 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:right-auto sm:w-80">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{selectedCity.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedCity.region}</p>
            </div>
            <button onClick={() => setSelected(null)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted" aria-label="Stäng">
              <MapPin size={15} />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-700">
              <TrendingUp size={13} />
              {selectedStats?.count ?? 0} upphandlingar
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <AlertCircle size={13} />
              {formatMoney(selectedStats?.value ?? 0)}
            </span>
          </div>
          <Link
            to={`/search?municipality=${selectedCity.id}`}
            className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline"
          >
            Visa i kontraktsök
          </Link>
        </div>
      )}
    </div>
  );
};

export default SwedenMap;
