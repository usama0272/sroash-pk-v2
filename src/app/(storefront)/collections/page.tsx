import type { Metadata } from "next";
import { ProductCard } from "@/components/shared/product-card";
import { ProductFilters } from "@/features/products/components/product-filters";
import { getProducts, type ProductFilters as Filters } from "@/features/products/queries/get-products";

export const metadata: Metadata = { title: "All Collections" };

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const filters: Filters = {
    sort: (sp.sort as Filters["sort"]) ?? "newest",
    sizes: sp.sizes?.split(","),
    page: sp.page ? parseInt(sp.page) : 1,
  };

  const { products, totalPages, page } = await getProducts(filters);

  return (
    <div className="container-luxury py-16">
      <h1 className="font-display text-4xl mb-10">All Collections</h1>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <ProductFilters />
        <div>
          {products.length === 0 ? (
            <p className="text-graphite">No products match these filters.</p>
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

          {totalPages > 1 && (
            <div className="mt-14 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <a
                  key={i}
                  href={`?page=${i + 1}`}
                  className={`h-9 w-9 flex items-center justify-center border text-sm ${
                    page === i + 1 ? "border-charcoal bg-charcoal text-ivory" : "border-line"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
