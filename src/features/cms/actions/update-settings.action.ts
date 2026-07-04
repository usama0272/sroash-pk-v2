"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac/guards";

export async function updateSettings(data: { storeName: string; currency: string; supportEmail: string }) {
  await requireRole("SUPER_ADMIN");
  await db.settings.upsert({ where: { id: "global" }, update: { data }, create: { id: "global", data } });
  revalidatePath("/admin/settings");
  return { ok: true };
}
