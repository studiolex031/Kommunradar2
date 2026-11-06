import { Link } from "react-router-dom";
import { MapPin, Clock3, ArrowUpRight, Bookmark } from "lucide-react";
import { Tender, statusLabels } from "@/data/demoData";
import { formatMoney, formatDate } from "@/lib/format";
import { useSavedTenders } from "@/hooks/useSavedTenders";

interface TenderCardProps {
  tender: Tender;
  municipalityName: string;
  compact?: boolean;
}

const TenderCard = ({ tender, municipalityName, compact = false }: TenderCardProps) => {
  const { has, toggle } = useSavedTenders();
  const saved = has(tender.id);

  const statusStyles = {
    open: "bg-emerald-100 text-emerald-700",
    "closing-soon": "bg-amber-100 text-amber-700",
    closed: "bg-slate-100 text-slate-600",
  };

  return (
    <article className={`tender-card group rounded-2xl border border-border bg-card p-5 shadow-sm ${compact ? "p-4" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[tender.status]}`}>
              {statusLabels[tender.status]}
            </span>
            <span className="text-xs text-muted-foreground">{tender.category}</span>
          </div>
          <h3 className={`mt-2 font-semibold leading-snug group-hover:text-primary ${compact ? "text-sm" : "text-base"}`}>
            <Link to={`/tender/${tender.id}`}>{tender.title}</Link>
          </h3>
        </div>
        <button
          type="button"
          onClick={() => toggle(tender.id)}
          className={saved ? "text-amber-500" : "text-muted-foreground hover:text-primary"}
          aria-label={saved ? "Ta bort från bevakning" : "Spara i bevakning"}
        >
          <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <p className={`mt-3 text-muted-foreground leading-relaxed ${compact ? "line-clamp-2 text-xs" : "line-clamp-3 text-sm"}`}>
        {tender.summary}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {municipalityName}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 size={13} />
            {formatDate(tender.deadline)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{formatMoney(tender.value)}</span>
          <Link
            to={`/tender/${tender.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            aria-label={`Öppna ${tender.title}`}
          >
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export { TenderCard };
export default TenderCard;
