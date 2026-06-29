import { db } from "@schrutefacts/db";
import { task } from "@schrutefacts/db/schema/task";
import { eq, and } from "drizzle-orm";
import z from "zod";

import { router, protectedProcedure } from "../index";

export const taskRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db.select().from(task).where(eq(task.userId, ctx.session.user.id));
  }),

  create: protectedProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      return await db.insert(task).values({
        text: input.text,
        userId: ctx.session.user.id,
      });
    }),

  toggle: protectedProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .update(task)
        .set({ completed: input.completed })
        .where(and(eq(task.id, input.id), eq(task.userId, ctx.session.user.id)));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .delete(task)
        .where(and(eq(task.id, input.id), eq(task.userId, ctx.session.user.id)));
    }),
});
