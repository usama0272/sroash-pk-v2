"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Invalid email or password.");
        toast.error("Invalid email or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    });
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-center mb-8">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Email</label>
          <input name="email" type="email" required className="input-luxury" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Password</label>
          <input name="password" type="password" required className="input-luxury" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={isPending} className="btn-luxury-dark w-full">
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <div className="mt-6 flex justify-between text-xs text-graphite">
        <Link href="/forgot-password" className="hover:text-charcoal">
          Forgot password?
        </Link>
        <Link href="/register" className="hover:text-charcoal">
          Create an account
        </Link>
      </div>
    </div>
  );
}
