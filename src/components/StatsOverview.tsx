import { TrendingUp, MapPin, Eye, FileText, ArrowUpRight } from "lucide-react";
import { type AnalyticsData, municipalities } from "@/data/demoData";
import { formatMoney } from "@/lib/format";

interface StatsOverviewProps {
  analytics: AnalyticsData;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  description,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  description: string;
  accent: string;
}) => (
  <div className="animate-slide-up rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
      <Icon size={19} />
    </div>
    <p className="mt-4 text-xs font-medium text-muted-foreground">{label}</p>
    <h3 className="mt-1 text-2xl font-bold tracking-tight">{value}</h3>
    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
  </div>
);

export const StatsOverview = ({ analytics }: StatsOverviewProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      label="Aktiva upphandlingar"
      value={analytics.openTenders.toString()}
      icon={Eye}
      description="Öppna och stängs snart"
      accent="bg-blue-100 text-blue-700"
    />
    <StatCard
      label="Totalt marknadsvärde"
      value={formatMoney(analytics.totalValue)}
      icon={TrendingUp}
      description={`${analytics.totalTenders} publicerade uppdrag`}
      accent="bg-emerald-100 text-emerald-700"
    />
    <StatCard
      label="Genomsnittligt värde"
      value={formatMoney(analytics.avgValue)}
      icon={FileText}
      description="Per upphandling"
      accent="bg-violet-100 text-violet-700"
    />
    <StatCard
      label="Kommuner i kartan"
      value={municipalities.length.toString()}
      icon={MapPin}
      description="Svenska kommuner och regioner"
      accent="bg-amber-100 text-amber-700"
    />
  </div>
);

export default StatsOverview;
