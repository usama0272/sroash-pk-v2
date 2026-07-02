"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { registerCustomer } from "@/features/auth/actions/register.action";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      const result = await registerCustomer({ name, email, password });
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      const signInResult = await signIn("credentials", { email, password, redirect: false });
      if (signInResult?.error) {
        toast.success("Account created. Please sign in.");
        router.push("/login");
      } else {
        toast.success("Welcome to SROASH.PK.");
        router.push("/");
        router.refresh();
      }
    });
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-center mb-8">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Full Name</label>
          <input name="name" required className="input-luxury" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Email</label>
          <input name="email" type="email" required className="input-luxury" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Password</label>
          <input name="password" type="password" required minLength={8} className="input-luxury" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={isPending} className="btn-luxury-dark w-full">
          {isPending ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-graphite">
        Already have an account?{" "}
        <Link href="/login" className="text-charcoal underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
