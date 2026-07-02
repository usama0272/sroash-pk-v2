import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "@/features/products/components/product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id }, include: { variants: true } }),
    db.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Edit Product</h1>
      <ProductForm
        categories={categories}
        productId={product.id}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          fabric: product.fabric ?? undefined,
          careInstructions: product.careInstructions ?? undefined,
          sku: product.sku,
          price: Number(product.price),
          salePrice: product.salePrice ? Number(product.salePrice) : undefined,
          heroImage: product.heroImage,
          gallery: product.gallery,
          categoryId: product.categoryId,
          isFeatured: product.isFeatured,
          isNewArrival: product.isNewArrival,
          isActive: product.isActive,
          isMadeToOrder: product.isMadeToOrder,
          seoTitle: product.seoTitle ?? undefined,
          seoDescription: product.seoDescription ?? undefined,
          tags: product.tags,
          variants: product.variants.map((v) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex ?? undefined,
            sku: v.sku,
            stock: v.stock,
          })),
        }}
      />
    </div>
  );
}
