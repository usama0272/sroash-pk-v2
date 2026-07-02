import Link from "next/link";
import { Reveal } from "@/components/animations/reveal";
import { ProductCard } from "@/components/shared/product-card";
import type { Product, ProductVariant } from "@prisma/client";

export function FeaturedGrid({
  title,
  subtitle,
  viewAllHref,
  products,
}: {
  title: string;
  subtitle?: string;
  viewAllHref: string;
  products: (Product & { variants: ProductVariant[] })[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-24">
      <div className="container-luxury">
        <Reveal className="mb-12 flex items-end justify-between">
          <div>
            <p className="eyebrow">{subtitle}</p>
            <h2 className="mt-2 font-display text-4xl">{title}</h2>
          </div>
          <Link
            href={viewAllHref}
            className="hidden text-sm uppercase tracking-widest hover:text-clay transition-colors sm:block"
          >
            View All →
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              priority={i < 4}
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
      </div>
    </section>
  );
}
