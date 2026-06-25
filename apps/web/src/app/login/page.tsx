"use client";

import { useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <main className="overflow-y-auto">
      <div className="container mx-auto max-w-md px-4 py-10 space-y-6">

        {/* Header */}
        <div className="relative border-[3px] border-foreground bg-primary text-primary-foreground p-6 shadow-pop-lg overflow-hidden">
          <div aria-hidden className="absolute -right-4 -bottom-4 text-[100px] leading-none opacity-[0.08] select-none pointer-events-none">
            🔐
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/20 border border-primary-foreground/30 text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-4">
              Security Checkpoint
            </div>
            <h1 className="font-heading text-4xl font-black uppercase leading-tight">
              {showSignIn ? "Identity\nVerification" : "Request\nAccess"}
            </h1>
            <p className="mt-2 text-xs text-primary-foreground/70 leading-relaxed">
              {showSignIn
                ? "Prove you are who you say you are. Dwight is watching."
                : "All applicants subject to background investigation and beet aptitude testing."}
            </p>
          </div>
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
