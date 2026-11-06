import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { analytics, categories, regions } from "@/data/demoData";

const COLORS = ["#0284C7", "#F59E0B", "#10B981", "#8B5CF6", "#EF4444"];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("6m");

  const totalValue = analytics.totalValue;
  const formatValue = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} mdkr`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} mnkr`;
    return `${(value / 1_000).toFixed(0)} tkr`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Analyser</h1>
            <p className="mt-1 text-muted-foreground">
              Övervaka trender, marknadsvolym och kommunstatistik
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
              <Calendar size={16} className="text-muted-foreground" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 border-0 bg-transparent p-0 text-sm focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Senaste månaden</SelectItem>
                  <SelectItem value="3m">3 månader</SelectItem>
                  <SelectItem value="6m">6 månader</SelectItem>
                  <SelectItem value="1y">1 år</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download size={16} />
              Exportera
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Totalt antal upphandlingar</CardTitle>
              <BarChart3 size={18} className="text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.totalTenders}</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
                <TrendingUp size={14} />
                <span className="font-medium">+18%</span>
                <span className="text-muted-foreground">vs förra perioden</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Totalt marknadsvärde</CardTitle>
              <TrendingUp size={18} className="text-emerald-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatValue(totalValue)}</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
                <TrendingUp size={14} />
                <span className="font-medium">+12%</span>
                <span className="text-muted-foreground">vs förra perioden</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Öppna upphandlingar</CardTitle>
              <ArrowUpRight size={18} className="text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.openTenders}</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
                <ArrowUpRight size={14} />
                <span className="font-medium">+5</span>
                <span className="text-muted-foreground">nya denna vecka</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Genomsnittligt värde</CardTitle>
              <PieChart size={18} className="text-amber-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatValue(analytics.avgValue)}</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                <TrendingDown size={14} />
                <span className="font-medium">-3%</span>
                <span className="text-muted-foreground">vs förra perioden</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Månadsvisa trender</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary"></span> Antal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Värde
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthlyTrends}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0284C7" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#0284C7"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                      name="Antal upphandlingar"
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      name="Marknadsvärde"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kategoriöversikt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#0284C7" name="Antal" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="value" fill="#0284C7" fillOpacity={0.3} name="Värde (mnkr)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Region Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Regional fördelning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={analytics.regionBreakdown}
                      dataKey="count"
                      nameKey="region"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ region, count }) => `${region}: ${count}`}
                    >
                      {analytics.regionBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Value Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Värde per kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.categoryBreakdown.map((cat, index) => (
                  <div key={cat.category} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: COLORS[index % COLORS.length] + "15" }}>
                      <div className="h-5 w-5 rounded-lg" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{cat.category}</span>
                        <span className="text-sm font-bold">{formatValue(cat.value)}</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(cat.value / totalValue) * 100 * 2}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{cat.count} upphandlingar</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
