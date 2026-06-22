"use client";

import { useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <main className="overflow-y-auto">
      <div className="container mx-auto max-w-md px-4 py-8 space-y-6">

        {/* Header badge */}
        <div className="border-4 border-foreground bg-primary text-primary-foreground p-6 text-center">
          <p className="font-brand text-xs uppercase tracking-[0.25em] mb-1 text-primary-foreground/70">
            Security Checkpoint
          </p>
          <h1 className="font-brand text-3xl font-bold uppercase">
            {showSignIn ? "Identity Verification" : "Request Access"}
          </h1>
          <p className="mt-2 text-xs text-primary-foreground/80">
            {showSignIn
              ? "Prove you are who you say you are. Dwight is watching."
              : "All applicants are subject to background investigation and beet aptitude testing."}
          </p>
        </div>

        {showSignIn ? (
          <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
        ) : (
          <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
        )}

      </div>
    </main>
  );
}
