"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac/guards";

export async function approveReview(id: string) {
  await requireRole("ADMIN", "SUPER_ADMIN");
  await db.review.update({ where: { id }, data: { isApproved: true } });
  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function deleteReview(id: string) {
  await requireRole("ADMIN", "SUPER_ADMIN");
  await db.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  return { ok: true };
}
