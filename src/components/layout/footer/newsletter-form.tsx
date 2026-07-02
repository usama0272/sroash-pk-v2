"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/features/cms/actions/newsletter.action";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await subscribeNewsletter(email);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("You're on the list.");
        setEmail("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="border-b border-charcoal/30 bg-transparent pb-2 text-sm outline-none focus:border-charcoal transition-colors"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-fit text-xs uppercase tracking-widest text-charcoal hover:text-clay transition-colors disabled:opacity-50"
      >
        {isPending ? "Subscribing..." : "Subscribe →"}
      </button>
    </form>
  );
}
