import { NavLink } from "react-router-dom";
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
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { getProfiles } from "@/lib/storage";
import { useSavedTenders } from "@/hooks/useSavedTenders";
import { useAccount } from "@/hooks/useAccount";

const navItems = [
  { to: "/", label: "Översikt", icon: LayoutDashboard },
  { to: "/search", label: "Kontraktsök", icon: Search },
  { to: "/map", label: "Sverigekarta", icon: Map },
  { to: "/watchlist", label: "Bevakningar", icon: Bell },
  { to: "/analytics", label: "Analyser", icon: BarChart3 },
  { to: "/ai-insights", label: "Insikter", icon: Radar },
  { to: "/missade", label: "Missade uppdrag", icon: History },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { count } = useSavedTenders();
  const { account } = useAccount();
  const activeProfiles = getProfiles().filter((profile) => profile.active).length;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-3 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg md:hidden"
        aria-label={open ? "Stäng meny" : "Öppna meny"}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 shadow-lg shadow-sky-200">
            <Radar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Kommunradar</h1>
            <p className="text-xs text-muted-foreground">Kontraktsök</p>
          </div>
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
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <div className="mt-8">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Konto
            </p>
            <NavLink
              to={account ? "/profil" : "/login"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <UserRound size={18} />
              {account ? "Min profil" : "Logga in"}
            </NavLink>
            <NavLink
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
            >
              <Settings size={18} />
              Inställningar
            </NavLink>
          </div>
        </nav>

        <div className="border-t border-border p-4">
          <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
            <p className="text-xs font-semibold text-slate-300">Din bevakning</p>
            <p className="mt-1 text-sm font-semibold">{count} sparade upphandlingar</p>
            <p className="mt-2 text-[11px] text-slate-300">{activeProfiles} aktiva profiler</p>
          </div>
        </div>
      </aside>

      {open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          aria-label="Stäng meny"
        />
      )}
    </>
  );
};

export default Sidebar;
