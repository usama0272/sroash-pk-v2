"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const emailSchema = z.string().email();

export async function subscribeNewsletter(email: string): Promise<{ ok?: true; error?: string }> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { error: "Enter a valid email address." };

  try {
    await db.newsletterSubscriber.upsert({
      where: { email: parsed.data },
      update: {},
      create: { email: parsed.data },
    });
    return { ok: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
