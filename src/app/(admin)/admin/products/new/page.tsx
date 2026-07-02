import { db } from "@/lib/db";
import { ProductForm } from "@/features/products/components/product-form";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
