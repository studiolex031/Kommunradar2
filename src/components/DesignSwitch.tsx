import { useLocation } from "react-router-dom";
import { Palette } from "lucide-react";

/** Sökvägsprefix för den alternativa designen (Kommunradar.online-varumärket). */
export const ALT_DESIGN_BASE = "/alternativ";

interface DesignSwitchProps {
  /** Vilken design länken leder till. */
  to: "alternativ" | "klassisk";
}

/**
 * Växlar mellan klassisk och alternativ design och behåller aktuell sida.
 * Samma komponent, text-mönster och placering används i båda designerna.
 * Vanlig <a> (helsidesladdning) eftersom designerna har separata routers.
 */
const DesignSwitch = ({ to }: DesignSwitchProps) => {
  const { pathname, search } = useLocation();
  // useLocation ger sökvägen utan router-basename i båda designerna
  const path = pathname === "/" ? "" : pathname;
  const href = to === "alternativ" ? `${ALT_DESIGN_BASE}${path}${search}` : `${path || "/"}${search}`;
  const label = to === "alternativ" ? "Alternativ design" : "Klassisk design";

  return (
    <a
      href={href}
      className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary"
      aria-label={`Byt till ${label.toLowerCase()}`}
      title={`Byt till ${label.toLowerCase()}`}
    >
      <Palette size={16} aria-hidden />
      <span className="hidden lg:inline">{label}</span>
    </a>
  );
};

export default DesignSwitch;
