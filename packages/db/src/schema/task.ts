import { pgTable, text, boolean, serial, index } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const task = pgTable(
  "task",
  {
    id: serial("id").primaryKey(),
    text: text("text").notNull(),
    completed: boolean("completed").default(false).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("task_userId_idx").on(t.userId)],
);
