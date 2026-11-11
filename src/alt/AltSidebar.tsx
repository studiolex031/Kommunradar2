import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Map,
  Bell,
  BarChart3,
  Settings,
  Menu,
  X,
  Radar,
  History,
} from "lucide-react";
import { useState } from "react";
import { getProfiles } from "@/lib/storage";
import { useSavedTenders } from "@/hooks/useSavedTenders";
import { BrandLogo, RadarArcs } from "@/components/brand/BrandLogo";

const navItems = [
  { to: "/", label: "Översikt", icon: LayoutDashboard },
  { to: "/search", label: "Kontraktsök", icon: Search },
  { to: "/map", label: "Sverigekarta", icon: Map },
  { to: "/watchlist", label: "Bevakningar", icon: Bell },
  { to: "/analytics", label: "Analyser", icon: BarChart3 },
  { to: "/ai-insights", label: "Insikter", icon: Radar },
  { to: "/missade", label: "Missade uppdrag", icon: History },
];

const AltSidebar = () => {
  const [open, setOpen] = useState(false);
  const { count } = useSavedTenders();
  const activeProfiles = getProfiles().filter((profile) => profile.active).length;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-3 z-50 rounded-full bg-kr-navy p-2.5 text-white shadow-lg shadow-kr-navy/20 transition-colors hover:bg-kr-ink md:hidden"
        aria-label={open ? "Stäng meny" : "Öppna meny"}
        aria-expanded={open}
        aria-controls="kr-sidebar"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        id="kr-sidebar"
        aria-label="Huvudmeny"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-border pl-16 pr-6 md:px-6">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block rounded-lg py-1"
            aria-label="Kommunradar.online – till översikten"
          >
            <BrandLogo variant="radar" decorative className="h-[34px] w-auto" />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigering
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? "bg-kr-ice font-semibold text-primary before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-full before:bg-kr-blue"
                    : "text-foreground/75 hover:bg-kr-ice/60 hover:text-foreground"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <div className="pt-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Konto
            </p>
            <NavLink
              to="/settings"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? "bg-kr-ice font-semibold text-primary before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-full before:bg-kr-blue"
                    : "text-foreground/75 hover:bg-kr-ice/60 hover:text-foreground"
                }`
              }
            >
              <Settings size={18} />
              Inställningar
            </NavLink>
          </div>
        </nav>

        <div className="border-t border-border p-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-kr-navy to-kr-ink p-4 text-white">
            <RadarArcs className="absolute -bottom-3 -right-4 h-16 w-auto opacity-40" />
            <p className="relative text-xs font-semibold text-white/80">Din bevakning</p>
            <p className="relative mt-1 text-sm font-semibold">{count} sparade upphandlingar</p>
            <p className="relative mt-2 flex items-center gap-1.5 text-[11px] text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-kr-yellow" aria-hidden />
              {activeProfiles} aktiva profiler
            </p>
          </div>
        </div>
      </aside>

      {open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-kr-navy/30 backdrop-blur-[1px] md:hidden"
          aria-label="Stäng meny"
        />
      )}
    </>
  );
};

export default AltSidebar;
