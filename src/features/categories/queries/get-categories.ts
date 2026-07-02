import "server-only";
import { db } from "@/lib/db";

export async function getActiveCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({ where: { slug, isActive: true } });
}
