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
      <div className="container mx-auto max-w-4xl px-4 py-10 space-y-6">
        <Dashboard session={session} />
      </div>
    </main>
  );
}
