"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac/guards";
import { slugify } from "@/lib/utils";

export async function createCategory(name: string, description: string) {
  await requireRole("ADMIN", "SUPER_ADMIN");
  if (!name.trim()) return { error: "Name is required." };
  await db.category.create({ data: { name, slug: slugify(name), description } });
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function toggleCategory(id: string, isActive: boolean) {
  await requireRole("ADMIN", "SUPER_ADMIN");
  await db.category.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/categories");
  return { ok: true };
}
