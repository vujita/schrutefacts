"use client";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

const DWIGHT_FACTS = [
  "Bears eat beets. Bears. Beets. Battlestar Galactica.",
  "The perfect farm has exactly 60 acres of beets, one silo, and zero unnecessary employees.",
  "The strongest metal is not steel. It is beet iron. I made that up, but it sounds right.",
  "Identity theft is not a joke. Millions of families suffer every year.",
  "In the wild, there is no healthcare. In the wild, healthcare is — ow, I hurt my foot.",
  "I am better than you have ever been or ever will be.",
  "Whenever I am about to do something, I think: would an idiot do that? If yes, I do not do that thing.",
];

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  const randomFact = DWIGHT_FACTS[Math.floor(DWIGHT_FACTS.length / 2)];

  return (
    <main className="overflow-y-auto">
      <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">

        {/* ── Hero ── */}
        <section className="border-4 border-foreground bg-primary text-primary-foreground p-8">
          <p className="font-brand text-xs uppercase tracking-[0.25em] mb-3 text-primary-foreground/70">
            Schrute Farms · Honesdale, Pennsylvania
          </p>
          <h1 className="font-brand text-5xl md:text-7xl font-bold leading-none mb-4 tracking-tight">
            SCHRUTEFACTS
          </h1>
          <p className="text-xl md:text-2xl font-bold mb-4">
            Bears. Beets. Battlestar Galactica.
          </p>
          <p className="text-sm md:text-base text-primary-foreground/80 max-w-xl">
            The world&apos;s foremost repository of Schrute family wisdom, beet-based intelligence,
            and hard facts. Not opinions. <em>Facts.</em>
          </p>
        </section>

        {/* ── FACT callout ── */}
        <section className="border-2 border-foreground bg-secondary text-secondary-foreground p-6">
          <p className="font-brand text-xs uppercase tracking-[0.2em] mb-2 text-secondary-foreground/70">
            Fact of the Day
          </p>
          <blockquote className="text-lg font-bold leading-snug">
            &ldquo;{randomFact}&rdquo;
          </blockquote>
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-secondary-foreground/60">
            — Dwight K. Schrute, Assistant Regional Manager
          </p>
        </section>

        {/* ── Two-column features ── */}
        <div className="grid md:grid-cols-3 gap-4">

          <div className="border-2 border-foreground bg-card text-card-foreground p-5 flex flex-col gap-3">
            <div className="text-3xl">🐻</div>
            <h3 className="font-brand text-lg font-bold uppercase">Bears</h3>
            <p className="text-sm text-muted-foreground">
              There are 8 species of bears. Black bears. Grizzly bears. Polar bears.
              False black bears. All of them dangerous. All of them real.
            </p>
          </div>

          <div className="border-2 border-foreground bg-accent text-accent-foreground p-5 flex flex-col gap-3">
            <div className="text-3xl">🌱</div>
            <h3 className="font-brand text-lg font-bold uppercase">Beets</h3>
            <p className="text-sm text-accent-foreground/80">
              Schrute Farms produces 15,000 lbs of beets annually. Beet varieties include
              red, yellow, and chioggia. All superior to every other crop.
            </p>
          </div>

          <div className="border-2 border-foreground bg-primary text-primary-foreground p-5 flex flex-col gap-3">
            <div className="text-3xl">🚀</div>
            <h3 className="font-brand text-lg font-bold uppercase">Battlestar</h3>
            <p className="text-sm text-primary-foreground/80">
              Battlestar Galactica is the greatest science fiction program ever produced.
              If you disagree, you are wrong. That is a fact.
            </p>
          </div>

        </div>

        {/* ── Network Status ── */}
        <section className="border-2 border-foreground bg-card text-card-foreground p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-brand text-sm uppercase tracking-widest font-bold">
              Schrute Farms Network Status
            </h2>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Live
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={[
                "h-3 w-3 rounded-full border-2 border-foreground",
                healthCheck.data ? "bg-primary" : "bg-destructive",
              ].join(" ")}
            />
            <span className="text-sm font-bold uppercase tracking-wide">
              {healthCheck.isLoading
                ? "Connecting to the beet mainframe..."
                : healthCheck.data
                  ? "All systems operational. As expected."
                  : "Disconnected. Someone unplugged the router again."}
            </span>
          </div>
        </section>

        {/* ── Footer strip ── */}
        <div className="border-t-2 border-foreground pt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-brand uppercase tracking-wide">
            Schrutefacts™
          </span>
          <span>Established by Dwight K. Schrute · All facts guaranteed accurate</span>
        </div>

      </div>
    </main>
  );
}
