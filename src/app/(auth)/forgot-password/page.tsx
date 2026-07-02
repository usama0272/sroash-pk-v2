"use client";

import { useState, useTransition } from "react";
import { requestPasswordReset } from "@/features/auth/actions/request-reset.action";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    startTransition(async () => {
      await requestPasswordReset({ email });
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="text-center">
        <h1 className="font-display text-3xl mb-4">Check Your Email</h1>
        <p className="text-graphite">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-center mb-8">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Email</label>
          <input name="email" type="email" required className="input-luxury" />
        </div>
        <button type="submit" disabled={isPending} className="btn-luxury-dark w-full">
          {isPending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
