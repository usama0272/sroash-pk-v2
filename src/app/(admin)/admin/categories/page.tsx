import { db } from "@/lib/db";
import { CategoryManager } from "@/features/categories/components/category-manager";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } });
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Categories</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
