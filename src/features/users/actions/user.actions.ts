"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac/guards";
import type { Role } from "@prisma/client";

export async function updateUserRole(userId: string, role: Role) {
  await requireRole("SUPER_ADMIN");
  await db.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  await requireRole("SUPER_ADMIN");
  await db.user.update({ where: { id: userId }, data: { isActive } });
  revalidatePath("/admin/users");
  return { ok: true };
}
