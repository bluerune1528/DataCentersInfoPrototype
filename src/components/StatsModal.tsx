import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type DataCenter, toSeries } from "@/lib/supabase";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  dc: DataCenter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StatsModal({ dc, open, onOpenChange }: Props) {
  if (!dc) return null;
  const water = toSeries(dc.water_consumption);
  const electricity = toSeries(dc.electricity_consumption);

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
          <ChartBlock title="Water Consumption" data={water} emptyMsg="No water data available." />
          <ChartBlock title="Electricity Consumption" data={electricity} emptyMsg="No electricity data available." />
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
}
