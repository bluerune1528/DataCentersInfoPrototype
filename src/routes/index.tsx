import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataCenterCard } from "@/components/DataCenterCard";
import { StatsModal } from "@/components/StatsModal";
import { supabase, type DataCenter } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Data Center Environmental Impact — Home" },
      { name: "description", content: "Search data centers by company or country and see their water, electricity, and pollution footprint." },
    ],
  }),
  component: Index,
});

function Index() {
  const [all, setAll] = useState<DataCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selected, setSelected] = useState<DataCenter | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await supabase.from("data_centers").select("*");
      if (!alive) return;
      if (error) setError(error.message);
      else setAll((data as DataCenter[]) ?? []);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(() => {
    if (!debounced) return all.slice(0, 8);
    return all
      .filter(
        (d) =>
          d.company?.toLowerCase().includes(debounced) ||
          d.country?.toLowerCase().includes(debounced) ||
          d.name?.toLowerCase().includes(debounced),
      )
      .slice(0, 10);
  }, [all, debounced]);

  const handleView = (dc: DataCenter) => {
    setSelected(dc);
    setOpen(true);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          The Environmental Footprint of Data Centers
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Data centers power the internet — but they consume vast amounts of water and
          electricity, and emit significant carbon. Understanding their impact is the first
          step toward a more sustainable digital infrastructure.
        </p>
      </section>

      <section className="mt-10 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by company (e.g. Google) or country (e.g. USA)"
            className="pl-9 h-11"
          />
        </div>
      </section>

      <section className="mt-10">
        {loading && <p className="text-center text-muted-foreground">Loading data centers…</p>}
        {error && (
          <p className="text-center text-destructive">Failed to load data: {error}</p>
        )}
        {!loading && !error && results.length === 0 && (
          <p className="text-center text-muted-foreground">No results found.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((dc) => (
            <DataCenterCard key={String(dc.id)} dc={dc} onViewStats={handleView} />
          ))}
        </div>
      </section>

      <StatsModal dc={selected} open={open} onOpenChange={setOpen} />
    </main>
  );
}
