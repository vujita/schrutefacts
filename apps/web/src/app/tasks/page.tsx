"use client";

import { Button } from "@schrutefacts/ui/components/button";
import { Checkbox } from "@schrutefacts/ui/components/checkbox";
import { Input } from "@schrutefacts/ui/components/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export default function TasksPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    if (!sessionPending && !session) {
      router.replace("/login");
    }
  }, [session, sessionPending, router]);

  const tasks = useQuery({
    ...trpc.task.getAll.queryOptions(),
    enabled: !!session,
  });
  const createMutation = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: () => {
        tasks.refetch();
        setNewTaskText("");
      },
    }),
  );
  const toggleMutation = useMutation(
    trpc.task.toggle.mutationOptions({ onSuccess: () => tasks.refetch() }),
  );
  const deleteMutation = useMutation(
    trpc.task.delete.mutationOptions({ onSuccess: () => tasks.refetch() }),
  );

  const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTaskText.trim()) createMutation.mutate({ text: newTaskText });
  };

  const completedCount = tasks.data?.filter((t) => t.completed).length ?? 0;
  const totalCount = tasks.data?.length ?? 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (sessionPending || !session) {
    return (
      <main className="overflow-y-auto">
        <div className="flex justify-center items-center gap-3 py-32 text-foreground/85">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-heading font-bold uppercase tracking-wide">
            Verifying credentials…
          </span>
        </div>
      </main>
    );
  }

  return (
    <main className="overflow-y-auto">
      <div className="container mx-auto max-w-2xl px-4 py-10 space-y-6">
        {/* Header */}
        <section className="relative border-[3px] border-foreground bg-secondary shadow-pop-lg overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-4 -bottom-4 text-[100px] leading-none opacity-[0.08] select-none pointer-events-none"
          >
            📋
          </div>
          <div className="relative p-6 md:p-8">
            <div className="inline-flex items-center gap-2 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-4 shadow-pop-sm">
              <span>🚜</span>
              <span>Schrute Farms · Official Task Log</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-black uppercase leading-none tracking-tight text-foreground">
              Schrute
              <br />
              <span className="text-primary">Duties</span>
            </h1>
            <p className="mt-3 text-sm text-foreground/90">
              Every task is critical. Every incomplete task is a personal failure.
            </p>
          </div>
        </section>

        {/* Progress */}
        {totalCount > 0 && (
          <div className="border-[3px] border-foreground bg-card p-4 shadow-pop-sm">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
              <span className="font-heading">Mission Progress</span>
              <span>
                {completedCount}/{totalCount} completed
              </span>
            </div>
            <div className="h-4 bg-muted border-2 border-foreground overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {completedCount === totalCount && totalCount > 0 && (
              <p className="mt-2 text-xs font-bold text-primary uppercase tracking-wide">
                ✓ All duties discharged. As Dwight intended.
              </p>
            )}
          </div>
        )}

        {/* Add form */}
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Assign a new duty…"
            disabled={createMutation.isPending}
            className="border-2 border-foreground bg-card placeholder:text-foreground/65 font-sans shadow-pop-sm focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
          />
          <Button
            type="submit"
            disabled={createMutation.isPending || !newTaskText.trim()}
            className="border-2 border-foreground font-heading font-black uppercase tracking-wide shrink-0 shadow-pop-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign"}
          </Button>
        </form>

        {/* Task list */}
        <div className="border-[3px] border-foreground bg-card shadow-pop">
          {tasks.isLoading ? (
            <div className="flex justify-center items-center gap-3 py-14 text-foreground/85">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-heading font-bold uppercase tracking-wide">
                Consulting the beet ledger…
              </span>
            </div>
          ) : tasks.data?.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-5xl mb-3">📋</p>
              <p className="font-heading font-black text-sm uppercase tracking-wide text-foreground/85">
                No duties assigned.
              </p>
              <p className="text-sm text-foreground/75 mt-1">
                This is either excellent news or suspicious.
              </p>
            </div>
          ) : (
            <ul>
              {tasks.data?.map((t, idx) => (
                <li
                  key={t.id}
                  className={[
                    "flex items-center justify-between px-4 py-3.5 gap-3 transition-colors hover:bg-muted/50",
                    idx !== (tasks.data?.length ?? 0) - 1 ? "border-b-2 border-foreground/15" : "",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Checkbox
                      checked={t.completed}
                      onCheckedChange={() =>
                        toggleMutation.mutate({ id: t.id, completed: !t.completed })
                      }
                      id={`task-${t.id}`}
                      className="border-2 border-foreground shrink-0"
                    />
                    <label
                      htmlFor={`task-${t.id}`}
                      className={[
                        "text-sm cursor-pointer truncate",
                        t.completed
                          ? "line-through text-foreground/60"
                          : "font-medium text-foreground",
                      ].join(" ")}
                    >
                      {t.text}
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate({ id: t.id })}
                    aria-label="Delete duty"
                    className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-foreground/80 text-center font-heading font-bold uppercase tracking-wide">
          Failure to complete duties will be noted in your permanent record.
        </p>
      </div>
    </main>
  );
}
