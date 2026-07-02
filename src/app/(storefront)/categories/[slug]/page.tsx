import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/shared/product-card";
import { ProductFilters } from "@/features/products/components/product-filters";
import { getProducts, type ProductFilters as Filters } from "@/features/products/queries/get-products";
import { getCategoryBySlug } from "@/features/categories/queries/get-categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "Category" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const filters: Filters = {
    categorySlug: slug,
    sort: (sp.sort as Filters["sort"]) ?? "newest",
    sizes: sp.sizes?.split(","),
    page: sp.page ? parseInt(sp.page) : 1,
  };

  const { products } = await getProducts(filters);

  return (
    <div className="container-luxury py-16">
      <h1 className="font-display text-4xl mb-2">{category.name}</h1>
      {category.description && <p className="mb-10 max-w-xl text-graphite">{category.description}</p>}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <ProductFilters />
        {products.length === 0 ? (
          <p className="text-graphite">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  heroImage: product.heroImage,
                  gallery: product.gallery,
                  price: Number(product.price),
                  salePrice: product.salePrice ? Number(product.salePrice) : null,
                  isNewArrival: product.isNewArrival,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
