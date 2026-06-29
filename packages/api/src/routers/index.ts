import { protectedProcedure, publicProcedure, router } from "../index";
import { taskRouter } from "./task";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  task: taskRouter,
});
export type AppRouter = typeof appRouter;
