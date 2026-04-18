import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Zap, Cloud, Leaf, MapPin } from "lucide-react";
<<<<<<< HEAD
import { type DataCenterResult } from "@/lib/search";

interface Props {
  dc: DataCenterResult;
  onViewStats: (dc: DataCenterResult) => void;
=======
import { type DataCenter, summarize } from "@/lib/supabase";

interface Props {
  dc: DataCenter;
  onViewStats: (dc: DataCenter) => void;
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
}

export function DataCenterCard({ dc, onViewStats }: Props) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">{dc.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{dc.company}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <MapPin className="size-3" />
<<<<<<< HEAD
          {dc.location}{dc.country ? `, ${dc.country}` : ""}
=======
          {dc.location}
          {dc.country ? `, ${dc.country}` : ""}
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-2 text-sm">
<<<<<<< HEAD
          <Stat icon={<Droplets className="size-4 text-primary" />} label="Water" value={dc.water_consumption || "—"} />
          <Stat icon={<Zap className="size-4 text-primary" />} label="Electricity" value={dc.electricity_consumption || "—"} />
          <Stat icon={<Cloud className="size-4 text-primary" />} label="Pollution" value={dc.pollution || "—"} />
=======
          <Stat icon={<Droplets className="size-4 text-primary" />} label="Water" value={`${summarize(dc.water_consumption)}`} />
          <Stat icon={<Zap className="size-4 text-primary" />} label="Electricity" value={`${summarize(dc.electricity_consumption)}`} />
          <Stat icon={<Cloud className="size-4 text-primary" />} label="Pollution" value={dc.pollution ? String(dc.pollution) : "—"} />
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
        </div>
        {dc.sustainability_steps && (
          <div className="text-sm text-muted-foreground border-t border-border pt-3">
            <div className="flex items-center gap-1 text-foreground font-medium mb-1">
              <Leaf className="size-3.5 text-primary" />
              Sustainability
            </div>
            <p className="line-clamp-3">{dc.sustainability_steps}</p>
          </div>
        )}
        <div className="mt-auto pt-2">
          <Button onClick={() => onViewStats(dc)} className="w-full" size="sm">
            View Stats
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
