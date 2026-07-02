import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/shared/product-card";
import { ProductFilters } from "@/features/products/components/product-filters";
import { getProducts, type ProductFilters as Filters } from "@/features/products/queries/get-products";
import { getCategoryBySlug } from "@/features/categories/queries/get-categories";

const VIRTUAL_COLLECTIONS: Record<string, { title: string; filters: Filters }> = {
  "new-arrivals": { title: "New Arrivals", filters: { newArrival: true } },
  "best-sellers": { title: "Best Sellers", filters: { featured: true } },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const virtual = VIRTUAL_COLLECTIONS[slug];
  if (virtual) return { title: virtual.title };
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "Collection" };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const virtual = VIRTUAL_COLLECTIONS[slug];
  let title: string;
  let baseFilters: Filters;

  if (virtual) {
    title = virtual.title;
    baseFilters = virtual.filters;
  } else {
    const category = await getCategoryBySlug(slug);
    if (!category) notFound();
    title = category.name;
    baseFilters = { categorySlug: slug };
  }

  const filters: Filters = {
    ...baseFilters,
    sort: (sp.sort as Filters["sort"]) ?? "newest",
    sizes: sp.sizes?.split(","),
    page: sp.page ? parseInt(sp.page) : 1,
  };

  const { products } = await getProducts(filters);

  return (
    <div className="container-luxury py-16">
      <h1 className="font-display text-4xl mb-10">{title}</h1>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <ProductFilters />
        {products.length === 0 ? (
          <p className="text-graphite">No products in this collection yet.</p>
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
