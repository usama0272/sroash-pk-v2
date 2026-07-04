"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac/guards";

export async function createCoupon(data: { code: string; type: "PERCENTAGE" | "FIXED"; value: number; minOrderValue?: number }) {
  await requireRole("ADMIN", "SUPER_ADMIN");
  if (!data.code.trim()) return { error: "Code is required." };
  const existing = await db.coupon.findUnique({ where: { code: data.code.toUpperCase() } });
  if (existing) return { error: "This coupon code already exists." };
  await db.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      type: data.type,
      value: data.value,
      minOrderValue: data.minOrderValue || null,
    },
  });
  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function toggleCoupon(id: string, isActive: boolean) {
  await requireRole("ADMIN", "SUPER_ADMIN");
  await db.coupon.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/coupons");
  return { ok: true };
}
