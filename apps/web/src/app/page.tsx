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
      <div className="container mx-auto max-w-4xl px-4 py-10 space-y-6">
        {/* ── Hero ── */}
        <section className="relative border-[3px] border-foreground bg-secondary shadow-pop-lg overflow-hidden">
          {/* Decorative oversized emoji watermark */}
          <div
            aria-hidden
            className="absolute -right-6 -bottom-6 text-[160px] leading-none opacity-[0.08] select-none pointer-events-none"
          >
            🐻
          </div>

          <div className="relative p-8 md:p-10">
            {/* Location tag */}
            <div className="inline-flex items-center gap-2 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 mb-5 shadow-pop-sm">
              <span>📍</span>
              <span>Schrute Farms · Honesdale, Pennsylvania</span>
            </div>

            <h1 className="font-heading text-7xl md:text-9xl font-black leading-none tracking-tight text-foreground uppercase mb-4">
              SCHRUTE
              <br />
              <span className="text-primary">FACTS</span>
            </h1>

            <p className="text-xl md:text-2xl font-bold mb-3 text-foreground">
              Bears. Beets. Battlestar Galactica.
            </p>
            <p className="text-sm text-foreground/70 max-w-lg leading-relaxed">
              The world&apos;s foremost repository of Schrute family wisdom, beet-based
              intelligence, and hard facts. Not opinions. <em>Facts.</em>
            </p>
          </div>
        </section>

        {/* ── Fact of the Day ── */}
        <section className="relative border-[3px] border-foreground bg-accent text-accent-foreground p-6 pt-8 shadow-pop hover-pop">
          <span className="label-sticker">Fact of the Day</span>

          <blockquote className="font-brand text-xl md:text-2xl leading-snug">
            &ldquo;{randomFact}&rdquo;
          </blockquote>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-accent-foreground/60">
            — Dwight K. Schrute, Assistant Regional Manager
          </p>
        </section>

        {/* ── Feature Cards ── */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="border-[3px] border-foreground bg-primary text-primary-foreground p-6 flex flex-col gap-3 shadow-pop hover-pop">
            <div className="text-4xl">🐻</div>
            <h3 className="font-heading text-xl font-black uppercase">Bears</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              There are 8 species of bears. Black bears. Grizzly bears. Polar bears. False black
              bears. All dangerous. All real.
            </p>
          </div>

          <div className="border-[3px] border-foreground bg-secondary text-secondary-foreground p-6 flex flex-col gap-3 shadow-pop hover-pop">
            <div className="text-4xl">🌱</div>
            <h3 className="font-heading text-xl font-black uppercase">Beets</h3>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              Schrute Farms produces 15,000 lbs of beets annually. Red, yellow, and chioggia.
              Superior to every other crop.
            </p>
          </div>

          <div className="border-[3px] border-foreground bg-muted text-foreground p-6 flex flex-col gap-3 shadow-pop hover-pop">
            <div className="text-4xl">🚀</div>
            <h3 className="font-heading text-xl font-black uppercase">Battlestar</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The greatest science fiction program ever produced. If you disagree, you are wrong.
              That is a fact.
            </p>
          </div>
        </div>

        {/* ── Network Status ── */}
        <section className="border-[3px] border-foreground bg-card p-4 shadow-pop-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={[
                "h-3 w-3 rounded-full border-2 border-foreground shrink-0",
                healthCheck.data ? "bg-primary animate-pulse" : "bg-destructive",
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
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-muted-foreground/40 px-2 py-0.5 shrink-0">
            Live
          </span>
        </section>

        {/* ── Footer ── */}
        <div className="border-t-[3px] border-foreground pt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-heading font-black uppercase tracking-wide text-foreground">
            Schrutefacts™
          </span>
          <span>All facts guaranteed accurate · D. K. Schrute</span>
        </div>
      </div>
    </main>
  );
}
