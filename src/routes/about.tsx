import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Data Center Environmental Impact" },
      { name: "description", content: "About this project: a simple, transparent view into the environmental footprint of the world's data centers." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>
      <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
        <p>
          This site brings together publicly reported data on data center water and electricity
          consumption, alongside their pollution output and the sustainability initiatives their
          operators have committed to.
        </p>
        <p>
          The goal is not to single out any one operator, but to make the scale of the digital
          infrastructure footprint visible — and to highlight technologies that are reducing it.
        </p>
        <p>
          Data is fetched from a curated database. Charts use Recharts. The site is built with
          React, TanStack Router, and Tailwind CSS.
        </p>
      </div>
    </main>
  );
}
