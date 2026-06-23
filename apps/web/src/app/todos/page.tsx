"use client";

import { Button } from "@schrutefacts/ui/components/button";
import { Checkbox } from "@schrutefacts/ui/components/checkbox";
import { Input } from "@schrutefacts/ui/components/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { trpc } from "@/utils/trpc";

type TodoId = number;

export default function TodosPage() {
  const [newTodoText, setNewTodoText] = useState("");

  const todos = useQuery(trpc.todo.getAll.queryOptions());
  const createMutation = useMutation(
    trpc.todo.create.mutationOptions({
      onSuccess: () => {
        todos.refetch();
        setNewTodoText("");
      },
    }),
  );
  const toggleMutation = useMutation(
    trpc.todo.toggle.mutationOptions({
      onSuccess: () => {
        todos.refetch();
      },
    }),
  );
  const deleteMutation = useMutation(
    trpc.todo.delete.mutationOptions({
      onSuccess: () => {
        todos.refetch();
      },
    }),
  );

  const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      createMutation.mutate({ text: newTodoText });
    }
  };

  const handleToggleTodo = (id: TodoId, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  const handleDeleteTodo = (id: TodoId) => {
    deleteMutation.mutate({ id });
  };

  const completedCount = todos.data?.filter((t) => t.completed).length ?? 0;
  const totalCount = todos.data?.length ?? 0;

  return (
    <main className="overflow-y-auto">
      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">

        {/* Header */}
        <section className="border-4 border-foreground bg-primary text-primary-foreground p-6">
          <p className="font-brand text-xs uppercase tracking-[0.2em] mb-1 text-primary-foreground/70">
            Schrute Farms · Official Task Log
          </p>
          <h1 className="font-brand text-4xl font-bold uppercase">Schrute Duties</h1>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Every task is critical. Every incomplete task is a personal failure.
          </p>
        </section>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="border-2 border-foreground bg-card p-4">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
              <span className="font-brand">Mission Progress</span>
              <span>{completedCount}/{totalCount} completed</span>
            </div>
            <div className="h-3 bg-muted border border-foreground overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%" }}
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
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <Input
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Assign a new duty…"
            disabled={createMutation.isPending}
            className="border-2 border-foreground bg-card placeholder:text-muted-foreground font-sans"
          />
          <Button
            type="submit"
            disabled={createMutation.isPending || !newTodoText.trim()}
            className="border-2 border-foreground font-bold uppercase tracking-wide shrink-0"
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Assign"
            )}
          </Button>
        </form>

        {/* Task list */}
        <div className="border-2 border-foreground bg-card">
          {todos.isLoading ? (
            <div className="flex justify-center items-center gap-3 py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-brand uppercase tracking-wide">
                Consulting the beet ledger…
              </span>
            </div>
          ) : todos.data?.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-brand text-sm uppercase tracking-wide text-muted-foreground">
                No duties assigned.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This is either excellent news or suspicious.
              </p>
            </div>
          ) : (
            <ul>
              {todos.data?.map((todo, idx) => (
                <li
                  key={todo.id}
                  className={[
                    "flex items-center justify-between px-4 py-3 gap-3",
                    idx !== (todos.data?.length ?? 0) - 1 ? "border-b-2 border-foreground/20" : "",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                      id={`todo-${todo.id}`}
                      className="border-2 border-foreground shrink-0"
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={[
                        "text-sm cursor-pointer truncate",
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : "font-medium text-foreground",
                      ].join(" ")}
                    >
                      {todo.text}
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTodo(todo.id)}
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

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center font-brand uppercase tracking-wide">
          Failure to complete duties will be noted in your permanent record.
        </p>

      </div>
    </main>
  );
}
