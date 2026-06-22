import { auth } from "@schrutefacts/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="overflow-y-auto">
      <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">

        {/* Page header */}
        <section className="border-4 border-foreground bg-primary text-primary-foreground p-6">
          <p className="font-brand text-xs uppercase tracking-[0.2em] mb-1 text-primary-foreground/70">
            Authorization Level: Assistant Regional Manager
          </p>
          <h1 className="font-brand text-4xl font-bold uppercase">Command Center</h1>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Welcome, <strong>{session.user.name}</strong>. You have cleared the minimum security
            threshold. Do not abuse this privilege.
          </p>
        </section>

        <Dashboard session={session} />

      </div>
    </main>
  );
}
