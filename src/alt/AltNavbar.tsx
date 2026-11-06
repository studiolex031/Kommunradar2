import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, Settings } from "lucide-react";
import { todayLabel } from "@/lib/format";
import { useSavedTenders } from "@/hooks/useSavedTenders";
import { useTenders } from "@/hooks/useTenders";
import { BrandLogo } from "@/components/brand/BrandLogo";
import DesignSwitch from "@/components/DesignSwitch";

const AltNavbar = () => {
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-md md:px-8">
      <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
        <span className="capitalize">{todayLabel()}</span>
        <span className="text-border">•</span>
        <span className="flex items-center gap-1.5 font-medium text-kr-teal-strong">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kr-teal opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-kr-teal" />
          </span>
          {newCount} nya senaste 14 dagarna
        </span>
      </div>

      <Link
        to="/"
        className="ml-12 shrink-0 rounded-lg py-1 md:hidden"
        aria-label="Kommunradar.online – till översikten"
      >
        <BrandLogo variant="radar" decorative className="h-[26px] w-auto max-[359px]:h-[22px]" />
      </Link>

      <div className="flex flex-1 items-center justify-end gap-3">
        <form onSubmit={onSearch} className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sök upphandlingar..."
            aria-label="Sök upphandlingar"
            className="h-10 w-48 rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-kr-blue focus:ring-2 focus:ring-kr-blue/25 lg:w-64"
          />
        </form>

        <DesignSwitch to="klassisk" />

        <Link
          to="/watchlist"
          className="relative rounded-xl border border-border bg-card p-2.5 text-foreground/75 transition-colors hover:border-kr-blue/40 hover:text-primary"
          aria-label="Bevakningar"
        >
          <Bell size={18} />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-kr-yellow px-1 text-[10px] font-bold text-kr-navy ring-2 ring-card">
              {count}
            </span>
          )}
        </Link>

        <Link
          to="/settings"
          className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:border-kr-blue/40 hover:text-primary md:flex"
        >
          <Settings size={16} />
          Inställningar
        </Link>
      </div>
    </header>
  );
};

export default AltNavbar;
