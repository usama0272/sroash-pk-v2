"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac/guards";

export async function updateHomepageHero(data: { image: string; headline: string; subheadline: string; ctaLabel: string; ctaHref: string }) {
  await requireRole("ADMIN", "SUPER_ADMIN");
  await db.cmsSection.upsert({
    where: { key: "homepage_hero" },
    update: { data },
    create: { key: "homepage_hero", data },
  });
  revalidatePath("/admin/cms/homepage");
  revalidatePath("/");
  return { ok: true };
}
