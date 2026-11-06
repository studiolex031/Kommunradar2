export function formatMoney(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "Ej angivet";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} mdkr`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} mnkr`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} tkr`;
  return `${Math.round(value)} kr`;
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function daysUntil(iso: string): number {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 0;
  return Math.ceil((date.getTime() - Date.now()) / 86_400_000);
}

export function todayLabel(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
