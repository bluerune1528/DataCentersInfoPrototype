import { createFileRoute } from "@tanstack/react-router";
<<<<<<< HEAD
import { useState, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataCenterCard } from "@/components/DataCenterCard";
import { StatsModal } from "@/components/StatsModal";
import { searchDataCenters, type DataCenterResult } from "@/lib/search";
=======
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataCenterCard } from "@/components/DataCenterCard";
import { StatsModal } from "@/components/StatsModal";
import { supabase, type DataCenter } from "@/lib/supabase";
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa

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
<<<<<<< HEAD
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DataCenterResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<DataCenterResult | null>(null);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      setSearched(true);
      try {
        const data = await searchDataCenters(value.trim());
        setResults(data);
      } catch (e) {
        setError("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleView = (dc: DataCenterResult) => {
=======
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
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
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
<<<<<<< HEAD
            onChange={(e) => handleSearch(e.target.value)}
=======
            onChange={(e) => setQuery(e.target.value)}
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
            placeholder="Search by company (e.g. Google) or country (e.g. USA)"
            className="pl-9 h-11"
          />
        </div>
      </section>

      <section className="mt-10">
<<<<<<< HEAD
        {loading && (
          <div className="flex justify-center items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Searching the web...
          </div>
        )}
        {error && <p className="text-center text-destructive">{error}</p>}
        {!loading && searched && results.length === 0 && (
          <p className="text-center text-muted-foreground">No results found.</p>
        )}
        {!loading && !searched && (
          <p className="text-center text-muted-foreground">Type a company or country name to search.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {results.map((dc, i) => (
            <DataCenterCard key={i} dc={dc} onViewStats={handleView} />
=======
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
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
          ))}
        </div>
      </section>

      <StatsModal dc={selected} open={open} onOpenChange={setOpen} />
    </main>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> e9ddaff4465dcca1f462608fd7bc8bbf972e0efa
