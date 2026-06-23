"use client";
import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export default function Dashboard({ session }: { session: typeof authClient.$Infer.Session }) {
  const privateData = useQuery(trpc.privateData.queryOptions());

  return (
    <div className="space-y-4">

      {/* Classified intel box */}
      <section className="border-2 border-foreground bg-secondary text-secondary-foreground p-5">
        <p className="font-brand text-xs uppercase tracking-[0.2em] mb-2 text-secondary-foreground/70">
          Classified Intel
        </p>
        <p className="font-bold text-lg">
          {privateData.isLoading
            ? "Retrieving data from the beet mainframe…"
            : privateData.data?.message ?? "No intel available. Check the perimeter."}
        </p>
      </section>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="border-2 border-foreground bg-card p-4">
          <p className="font-brand text-xs uppercase tracking-widest text-muted-foreground mb-1">Threat Level</p>
          <p className="text-2xl font-bold text-accent">Beet Red</p>
        </div>
        <div className="border-2 border-foreground bg-card p-4">
          <p className="font-brand text-xs uppercase tracking-widest text-muted-foreground mb-1">Beet Crop</p>
          <p className="text-2xl font-bold">15,000 lbs</p>
        </div>
        <div className="border-2 border-foreground bg-card p-4 col-span-2 md:col-span-1">
          <p className="font-brand text-xs uppercase tracking-widest text-muted-foreground mb-1">Rank</p>
          <p className="text-2xl font-bold text-primary">Asst. Reg. Mgr.</p>
        </div>
      </div>

      {/* Daily directive */}
      <section className="border-l-4 border-accent bg-muted text-foreground p-5">
        <p className="font-brand text-xs uppercase tracking-[0.2em] mb-2 text-muted-foreground">
          Daily Directive from D. Schrute
        </p>
        <p className="text-sm font-medium italic">
          &ldquo;Today&apos;s priorities: (1) Patrol the perimeter. (2) Check beet moisture levels.
          (3) Review the latest Battlestar episode. All other tasks are secondary.&rdquo;
        </p>
      </section>

    </div>
  );
}
