import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, Settings } from "lucide-react";
import { todayLabel } from "@/lib/format";
import { useSavedTenders } from "@/hooks/useSavedTenders";
import { useTenders } from "@/hooks/useTenders";
import DesignSwitch from "@/components/DesignSwitch";

const Navbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { count } = useSavedTenders();
  const { data: tenders = [] } = useTenders();
  const newCount = tenders.filter((tender) => {
    const posted = new Date(tender.posted).getTime();
    return Date.now() - posted < 14 * 86_400_000;
  }).length;

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    const next = query.trim();
    navigate(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur-md md:px-8">
      <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
        <span className="capitalize">{todayLabel()}</span>
        <span className="text-border">•</span>
        <span className="flex items-center gap-1.5 text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {newCount} nya senaste 14 dagarna
        </span>
      </div>

      <div className="ml-12 flex flex-1 items-center justify-end gap-3 md:ml-0">
        <form onSubmit={onSearch} className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sök upphandlingar..."
            className="h-10 w-64 rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </form>

        <DesignSwitch to="alternativ" />

        <Link
          to="/watchlist"
          className="relative rounded-xl border border-border bg-background p-2.5 text-foreground/70 transition-colors hover:text-primary"
          aria-label="Bevakningar"
        >
          <Bell size={18} />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>

        <Link
          to="/settings"
          className="hidden items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40 md:flex"
        >
          <Settings size={16} />
          Inställningar
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
