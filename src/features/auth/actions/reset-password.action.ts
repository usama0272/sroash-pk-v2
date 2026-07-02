"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(10),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function resetPassword(input: { email: string; token: string; password: string }) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const { email, token, password } = parsed.data;

  const record = await db.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
  });

  if (!record || record.expires < new Date()) {
    return { error: "This reset link is invalid or has expired." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.$transaction([
    db.user.update({ where: { email }, data: { passwordHash } }),
    db.verificationToken.delete({ where: { identifier_token: { identifier: email, token } } }),
  ]);

  return { ok: true };
}
