import { createDb } from "@schrutefacts/db";
import * as schema from "@schrutefacts/db/schema/auth";
import { env } from "@schrutefacts/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",

      schema: schema,
    }),
    trustedOrigins: [
      env.CORS_ORIGIN,
      "https://schrutefacts-web.vercel.app",
      "https://schrutefacts.com",
      "https://www.schrutefacts.com",
      // Covers dynamic preview deployment URLs injected by Vercel per-deployment
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ],
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    plugins: [nextCookies()],
  });
}

export const auth = createAuth();
