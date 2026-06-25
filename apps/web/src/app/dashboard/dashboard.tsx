"use client";
import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export default function Dashboard({ session }: { session: typeof authClient.$Infer.Session }) {
  const privateData = useQuery(trpc.privateData.queryOptions());

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="border-[3px] border-foreground bg-primary text-primary-foreground p-5 shadow-pop flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60 mb-1">
            Authenticated Personnel
          </p>
          <p className="font-heading text-2xl font-black uppercase">
            Welcome, {session.user.name ?? "Agent"}
          </p>
        </div>
        <span className="text-4xl">🔐</span>
      </div>

      {/* Classified intel */}
      <section className="relative border-[3px] border-foreground bg-secondary text-secondary-foreground p-6 pt-8 shadow-pop hover-pop">
        <span className="label-sticker">Classified Intel</span>
        <p className="font-bold text-lg leading-snug">
          {privateData.isLoading
            ? "Retrieving data from the beet mainframe…"
            : privateData.data?.message ?? "No intel available. Check the perimeter."}
        </p>
      </section>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        <div className="border-[3px] border-foreground bg-accent text-accent-foreground p-5 shadow-pop-sm hover-pop">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent-foreground/60 mb-1">
            Threat Level
          </p>
          <p className="font-heading text-3xl font-black uppercase leading-tight">
            Beet<br />Red
          </p>
        </div>

        <div className="border-[3px] border-foreground bg-card p-5 shadow-pop-sm hover-pop">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Beet Crop
          </p>
          <p className="font-heading text-3xl font-black">
            15,000
            <span className="text-base font-bold ml-1 text-muted-foreground">lbs</span>
          </p>
        </div>

        <div className="border-[3px] border-foreground bg-secondary text-secondary-foreground p-5 col-span-2 md:col-span-1 shadow-pop-sm hover-pop">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-foreground/60 mb-1">
            Rank
          </p>
          <p className="font-heading text-2xl font-black uppercase leading-tight">
            Asst. Reg.<br />Manager
          </p>
        </div>

      </div>

      {/* Daily directive */}
      <section className="border-[3px] border-foreground bg-card p-5 shadow-pop-sm">
        <p className="font-heading text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Daily Directive — D. Schrute
        </p>
        <p className="font-brand text-base italic leading-relaxed text-foreground">
          &ldquo;Today&apos;s priorities: (1) Patrol the perimeter. (2) Check beet moisture levels.
          (3) Review the latest Battlestar episode. All other tasks are secondary.&rdquo;
        </p>
      </section>

    </div>
  );
}
