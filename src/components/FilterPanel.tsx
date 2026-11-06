import { X } from "lucide-react";
import { useState } from "react";
import { categories, regions } from "@/data/demoData";

export interface FilterState {
  category: string[];
  region: string[];
  minValue: number;
  status: string[];
}

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterState) => void;
  value: FilterState;
}

const FilterPanel = ({ open, onClose, onFilterChange, value }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterState>(value);

  const apply = (next: FilterState) => {
    setFilters(next);
    onFilterChange(next);
  };

  const toggleItem = (key: "category" | "region" | "status", item: string) => {
    const current = filters[key];
    const updated = current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item];
    apply({ ...filters, [key]: updated });
  };

  const resetFilters = () => {
    apply({ category: [], region: [], minValue: 0, status: ["open", "closing-soon"] });
  };

  return (
    <>
      {open && <button className="fixed inset-0 z-40 bg-black/20" onClick={onClose} aria-label="Stäng filter" />}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-border bg-card shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div>
            <h2 className="text-lg font-bold">Filter</h2>
            <p className="text-xs text-muted-foreground">Förfina kontraktsöket</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Stäng filter">
            <X size={20} />
          </button>
        </div>

        <div className="h-[calc(100vh-9rem)] overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-semibold">Kategori</h3>
              <div className="mt-3 space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => toggleItem("category", category)}
                      className="h-4 w-4 rounded border-border text-primary"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold">Region</h3>
              <div className="mt-3 space-y-2">
                {regions.map((region) => (
                  <label key={region} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3">
                    <input
                      type="checkbox"
                      checked={filters.region.includes(region)}
                      onChange={() => toggleItem("region", region)}
                      className="h-4 w-4 rounded border-border text-primary"
                    />
                    <span className="text-sm">{region}</span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold">Status</h3>
              <div className="mt-3 space-y-2">
                {[
                  { value: "open", label: "Öppen" },
                  { value: "closing-soon", label: "Stängs snart" },
                  { value: "closed", label: "Stängd" },
                ].map((status) => (
                  <label key={status.value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status.value)}
                      onChange={() => toggleItem("status", status.value)}
                      className="h-4 w-4 rounded border-border text-primary"
                    />
                    <span className="text-sm">{status.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Minsta värde</h3>
                <span className="text-xs font-semibold text-primary">
                  {filters.minValue >= 1_000_000 ? `${filters.minValue / 1_000_000} mnkr` : "Alla"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50000000"
                step="5000000"
                value={filters.minValue}
                onChange={(event) => apply({ ...filters, minValue: Number(event.target.value) })}
                className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted"
              />
            </section>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card p-4">
          <button onClick={resetFilters} className="w-full rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-muted">
            Rensa filter
          </button>
          <button onClick={onClose} className="mt-2 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
            Visa resultat
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterPanel;
