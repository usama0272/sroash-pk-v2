import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/shared/product-card";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/wishlist");

  const items = await db.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-luxury py-16">
      <h1 className="font-display text-4xl mb-10">My Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-graphite">Nothing saved yet. Tap the heart on any product to add it here.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {items.map(({ product }) => (
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
  );
}
