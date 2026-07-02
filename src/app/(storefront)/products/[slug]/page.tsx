import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { ProductCard } from "@/components/shared/product-card";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { AddToCartForm } from "@/features/products/components/add-to-cart-form";
import { getProductBySlug, getRelatedProducts } from "@/features/products/queries/get-products";
import { formatPKR } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.description.slice(0, 160),
    openGraph: { images: [product.heroImage] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const images = [product.heroImage, ...product.gallery];
  const price = Number(product.price);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div className="container-luxury py-12">
      <div className="grid gap-14 lg:grid-cols-2">
        <ProductGallery images={images} alt={product.name} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{product.category.name}</p>
          <h1 className="mt-2 font-display text-4xl">{product.name}</h1>

          {product.reviews.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="flex text-clay">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-clay" : ""}`} />
                ))}
              </div>
              <span className="text-graphite">({product.reviews.length} reviews)</span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3 text-xl">
            {salePrice ? (
              <>
                <span className="text-clay">{formatPKR(salePrice)}</span>
                <span className="text-graphite/50 line-through">{formatPKR(price)}</span>
              </>
            ) : (
              <span>{formatPKR(price)}</span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-graphite">{product.description}</p>

          <div className="mt-8">
            <AddToCartForm
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={product.heroImage}
              price={salePrice ?? price}
              variants={product.variants}
            />
          </div>

          {(product.fabric || product.careInstructions) && (
            <dl className="mt-10 space-y-3 border-t border-line pt-6 text-sm">
              {product.fabric && (
                <div className="flex gap-2">
                  <dt className="w-28 text-graphite">Fabric</dt>
                  <dd>{product.fabric}</dd>
                </div>
              )}
              {product.careInstructions && (
                <div className="flex gap-2">
                  <dt className="w-28 text-graphite">Care</dt>
                  <dd>{product.careInstructions}</dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="w-28 text-graphite">SKU</dt>
                <dd>{product.sku}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {product.reviews.length > 0 && (
        <section className="mt-24 max-w-2xl">
          <h2 className="font-display text-3xl mb-8">Customer Reviews</h2>
          <div className="space-y-8">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-line pb-6">
                <div className="flex text-clay">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-clay" />
                  ))}
                </div>
                {review.title && <p className="mt-2 font-medium">{review.title}</p>}
                <p className="mt-1 text-sm text-graphite">{review.comment}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-graphite/70">
                  {review.user.name ?? "Verified Buyer"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <h2 className="font-display text-3xl mb-10">You May Also Like</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  heroImage: p.heroImage,
                  gallery: p.gallery,
                  price: Number(p.price),
                  salePrice: p.salePrice ? Number(p.salePrice) : null,
                  isNewArrival: p.isNewArrival,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
