# Auth Recovery Plan

## Current State

The app uses **better-auth v1** with email/password login backed by Drizzle ORM + PostgreSQL. The `verification` table is already in the schema and ready to store OTP/reset codes. What's missing:

- No email provider configured (no `sendResetPassword` or `sendVerificationEmail` callbacks)
- No recovery path if a user forgets their password
- No email verification on sign-up
- No 2FA or backup codes

---

## Option A — Email-Based Recovery (Recommended Starting Point)

This is the most standard path and better-auth makes it straightforward to wire up.

### Step 1: Pick an Email Provider

| Provider              | Free Tier       | Next.js Friendly   | Notes                    |
| --------------------- | --------------- | ------------------ | ------------------------ |
| **Resend**            | 3,000 emails/mo | Yes (official SDK) | Best DX, built for devs  |
| **Postmark**          | 100/mo trial    | Yes                | Highest deliverability   |
| **SendGrid**          | 100/day         | Yes                | Widely used, more config |
| **Nodemailer + SMTP** | n/a             | Any SMTP works     | Good for self-hosted/dev |

**Recommendation: Resend.** Dead-simple API, great Next.js docs, free tier is generous enough to start.

### Step 2: Install Resend

```bash
pnpm add resend --filter @schrutefacts/auth
```

Add to `packages/env/src/server.ts`:

```ts
RESEND_API_KEY: z.string().min(1),
FROM_EMAIL: z.string().email().default("noreply@schrutefacts.com"),
```

### Step 3: Wire Up Password Reset in better-auth

In `packages/auth/src/index.ts`, extend `emailAndPassword`:

```ts
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

emailAndPassword: {
  enabled: true,
  sendResetPassword: async ({ user, url }) => {
    await resend.emails.send({
      from: env.FROM_EMAIL,
      to: user.email,
      subject: "Reset your Schrutefacts password",
      html: `<p>Click <a href="${url}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    });
  },
},
```

### Step 4: Add a Reset Password UI Page

Create `apps/web/src/app/forgot-password/page.tsx` — a form that calls:

```ts
import { authClient } from "@/lib/auth-client";

await authClient.requestPasswordReset({ email });
```

And a reset form at `apps/web/src/app/reset-password/page.tsx` that reads the `?token=` param from the email link and calls:

```ts
await authClient.resetPassword({ token, newPassword });
```

better-auth handles token generation, storage in the `verification` table, and expiry automatically.

### Step 5: (Optional but Recommended) Email Verification on Sign-Up

Add the `emailVerification` plugin to tell better-auth to send a verification email when a new account is created:

```ts
import { emailVerification } from "better-auth/plugins";

plugins: [
  nextCookies(),
  emailVerification({
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: env.FROM_EMAIL,
        to: user.email,
        subject: "Verify your Schrutefacts email",
        html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
      });
    },
  }),
],
```

This also blocks unverified users from accessing protected routes if you set `requireEmailVerification: true`.

---

## Option B — TOTP / Authenticator App (No Email Required)

If you want a recovery path that doesn't depend on email at all, better-auth's `twoFactor` plugin includes both TOTP and backup codes.

### Install the plugin (it's built into better-auth)

```ts
import { twoFactor } from "better-auth/plugins";

plugins: [
  nextCookies(),
  twoFactor({
    issuer: "Schrutefacts",
    // backup codes are generated automatically; store them on first setup
  }),
],
```

### How recovery works with TOTP

1. On 2FA setup, better-auth generates a set of one-time **backup codes** (stored hashed in the DB).
2. If the user loses their authenticator app, they use a backup code to log in.
3. After a backup code is used, it's invalidated.

This requires **zero email or SMS** but the user must save their backup codes when setting up 2FA. Show them clearly on the setup screen and encourage download/print.

### UI you'd need to build

- 2FA setup page: display QR code from `authClient.twoFactor.getTOTPUri()`, verify first TOTP code
- Login step: after password, prompt for TOTP code or backup code
- Backup code management page: let users regenerate codes

---

## Option C — OAuth Social Login as Recovery Path

Adding Google or GitHub OAuth gives users an alternative login that bypasses the password entirely, acting as a recovery path if they forget their password.

```ts
import { socialProviders } from "better-auth/plugins";

socialProviders: {
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  },
},
```

better-auth will link the OAuth account to an existing user by matching email, so a user who signed up with email/password can recover via Google if the email matches.

**Caveats:** Requires creating OAuth credentials in Google Cloud Console / GitHub Developer Settings, and storing two more env vars.

---

## Recommended Implementation Order

| Priority | Task                                       | Effort   | Unlocks              |
| -------- | ------------------------------------------ | -------- | -------------------- |
| 1        | Set up Resend account + API key            | ~15 min  | All email flows      |
| 2        | Add `sendResetPassword` callback           | ~30 min  | Password reset       |
| 3        | Add forgot-password + reset-password pages | ~1–2 hrs | Full reset UX        |
| 4        | Add `emailVerification` plugin             | ~30 min  | Verified email badge |
| 5        | Add TOTP 2FA + backup codes                | ~2–4 hrs | No-email recovery    |
| 6        | Add Google OAuth                           | ~1 hr    | Social recovery path |

---

## Environment Variables to Add

```env
# Required for email flows
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@schrutefacts.com

# Optional: Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Add these to `packages/env/src/server.ts` and your deployment environment (Vercel dashboard / `.env.local`).

---

## Key better-auth Docs

- Password reset: https://www.better-auth.com/docs/plugins/email-password
- Email verification: https://www.better-auth.com/docs/plugins/email-verification
- Two factor / TOTP: https://www.better-auth.com/docs/plugins/two-factor
- Social providers: https://www.better-auth.com/docs/authentication/social-sign-on
