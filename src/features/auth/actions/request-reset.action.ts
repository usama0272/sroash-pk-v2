"use server";

import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({ email: z.string().email() });

export async function requestPasswordReset(input: { email: string }) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "Enter a valid email address." };

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  // Always return ok — don't leak whether an email is registered.
  if (!user) return { ok: true };

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await db.verificationToken.create({
    data: { identifier: user.email, token, expires },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

  // TODO: wire up transactional email provider (Resend/Postmark). Logged for now so the flow is testable.
  console.log(`[password-reset] ${resetUrl}`);

  return { ok: true };
}
