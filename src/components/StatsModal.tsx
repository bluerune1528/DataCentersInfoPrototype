import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
<<<<<<< HEAD
import { type DataCenterResult } from "@/lib/search";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  dc: DataCenterResult | null;
=======
import { type DataCenter, toSeries } from "@/lib/supabase";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  dc: DataCenter | null;
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StatsModal({ dc, open, onOpenChange }: Props) {
  if (!dc) return null;
<<<<<<< HEAD

  const water = parseToChart(dc.water_consumption);
  const electricity = parseToChart(dc.electricity_consumption);
=======
  const water = toSeries(dc.water_consumption);
  const electricity = toSeries(dc.electricity_consumption);
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dc.name}</DialogTitle>
          <DialogDescription>
            {dc.company} — {dc.location}
            {dc.country ? `, ${dc.country}` : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
<<<<<<< HEAD
          <ChartBlock title="Water Consumption" data={water} raw={dc.water_consumption} emptyMsg="No water data available." />
          <ChartBlock title="Electricity Consumption" data={electricity} raw={dc.electricity_consumption} emptyMsg="No electricity data available." />
          {dc.pollution && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Pollution / Carbon Output</h3>
              <p className="text-sm text-muted-foreground">{dc.pollution}</p>
            </div>
          )}
          {dc.sustainability_steps && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Sustainability Steps</h3>
              <p className="text-sm text-muted-foreground">{dc.sustainability_steps}</p>
            </div>
          )}
=======
          <ChartBlock title="Water Consumption" data={water} emptyMsg="No water data available." />
          <ChartBlock title="Electricity Consumption" data={electricity} emptyMsg="No electricity data available." />
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
        </div>
      </DialogContent>
    </Dialog>
  );
}

<<<<<<< HEAD
function parseToChart(raw: string): { label: string; value: number }[] {
  if (!raw || raw === "N/A") return [];
  const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return [];
  return [{ label: "Reported", value: num }];
}

function ChartBlock({
  title, data, raw, emptyMsg,
}: {
  title: string;
  data: { label: string; value: number }[];
  raw: string;
  emptyMsg: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-2">{raw || "—"}</p>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMsg}</p>
      ) : (
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} />
=======
function ChartBlock({ title, data, emptyMsg }: { title: string; data: { year: string; value: number }[]; emptyMsg: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMsg}</p>
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  color: "var(--popover-foreground)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
