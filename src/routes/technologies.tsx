import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/technologies")({
  head: () => ({
    meta: [
      { title: "Emerging Technologies — Data Center Sustainability" },
      { name: "description", content: "Innovative technologies making data centers cleaner: immersion cooling, AI power management, renewable integration, and liquid cooling." },
    ],
  }),
  component: Technologies,
});

const TECHS = [
  {
    name: "Immersion Cooling",
    desc: "Servers are submerged in a non-conductive dielectric fluid that absorbs heat far more efficiently than air, cutting cooling energy by up to 90%.",
    href: "https://en.wikipedia.org/wiki/Liquid_immersion_cooling",
  },
  {
    name: "AI-Based Power Management",
    desc: "Machine learning models predict workload and adjust cooling, voltage, and fan speeds in real time. Google reported a 40% reduction in cooling energy using DeepMind.",
    href: "https://deepmind.google/discover/blog/deepmind-ai-reduces-google-data-centre-cooling-bill-by-40/",
  },
  {
    name: "Renewable Energy Integration",
    desc: "On-site solar, wind, and grid PPAs are replacing fossil power. Many hyperscalers now match 100% of their annual consumption with renewables.",
    href: "https://en.wikipedia.org/wiki/Renewable_energy",
  },
  {
    name: "Liquid Cooling",
    desc: "Direct-to-chip and rear-door heat exchangers transfer heat with water or coolant loops, enabling much higher rack densities than traditional air cooling.",
    href: "https://en.wikipedia.org/wiki/Computer_cooling#Liquid_cooling",
  },
];

function Technologies() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Emerging Technologies</h1>
        <p className="mt-3 text-muted-foreground">
          Innovations driving the next generation of efficient, lower-impact data centers.
        </p>
      </header>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {TECHS.map((t) => (
          <Card key={t.name}>
            <CardHeader>
              <CardTitle>{t.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              <Button asChild variant="outline" size="sm">
                <a href={t.href} target="_blank" rel="noreferrer">
                  Learn more <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
