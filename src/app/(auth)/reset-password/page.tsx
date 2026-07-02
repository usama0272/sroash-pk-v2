"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { resetPassword } from "@/features/auth/actions/reset-password.action";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const password = new FormData(e.currentTarget).get("password") as string;

    startTransition(async () => {
      const result = await resetPassword({ email, token, password });
      if (result.error) {
        setError(result.error);
        return;
      }
      toast.success("Password updated. Please sign in.");
      router.push("/login");
    });
  }

  if (!token || !email) {
    return <p className="text-center text-graphite">This reset link is invalid.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-center mb-8">Set New Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">New Password</label>
          <input name="password" type="password" required minLength={8} className="input-luxury" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={isPending} className="btn-luxury-dark w-full">
          {isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
