import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anon);

export interface DataCenter {
  id: string | number;
  name: string;
  company: string;
  country: string;
  location: string;
  water_consumption: number | Record<string, number> | Array<{ year: number | string; value: number }> | null;
  electricity_consumption: number | Record<string, number> | Array<{ year: number | string; value: number }> | null;
  pollution: string | number | null;
  sustainability_steps: string | null;
  technology_links: string | string[] | null;
}

export type SeriesPoint = { year: string; value: number };

export function toSeries(
  raw: DataCenter["water_consumption"] | DataCenter["electricity_consumption"],
): SeriesPoint[] {
  if (raw == null) return [];
  if (typeof raw === "number") return [{ year: "Annual", value: raw }];
  if (Array.isArray(raw)) {
    return raw
      .map((p) => ({ year: String(p.year), value: Number(p.value) }))
      .filter((p) => !Number.isNaN(p.value));
  }
  if (typeof raw === "object") {
    return Object.entries(raw)
      .map(([year, value]) => ({ year: String(year), value: Number(value) }))
      .filter((p) => !Number.isNaN(p.value))
      .sort((a, b) => a.year.localeCompare(b.year));
  }
  return [];
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(n);
}

export function summarize(
  raw: DataCenter["water_consumption"] | DataCenter["electricity_consumption"],
): string {
  const series = toSeries(raw);
  if (series.length === 0) return "—";
  if (series.length === 1) return formatNumber(series[0].value);
  const latest = series[series.length - 1];
  return `${formatNumber(latest.value)} (${latest.year})`;
}
