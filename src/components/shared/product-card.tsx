"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { formatPKR, cn } from "@/lib/utils";
import { toggleWishlist } from "@/features/wishlist/actions/wishlist.actions";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  heroImage: string;
  gallery: string[];
  price: number;
  salePrice: number | null;
  isNewArrival: boolean;
}

export function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const router = useRouter();
  const secondaryImage = product.gallery[0] ?? product.heroImage;
  const onSale = product.salePrice !== null && product.salePrice < product.price;

  async function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    const result = await toggleWishlist(product.id);
    if (result.needsAuth) {
      toast.error("Please sign in to save items.");
      router.push("/login");
      return;
    }
    setWishlisted(result.wishlisted ?? false);
  }

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-sand">
          <Image
            src={product.heroImage}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "object-cover transition-opacity duration-700 ease-luxury",
              hovered && secondaryImage !== product.heroImage ? "opacity-0" : "opacity-100"
            )}
          />
          {secondaryImage !== product.heroImage && (
            <Image
              src={secondaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={cn(
                "object-cover transition-opacity duration-700 ease-luxury",
                hovered ? "opacity-100" : "opacity-0"
              )}
            />
          )}

          {product.isNewArrival && (
            <span className="absolute left-3 top-3 bg-ivory px-3 py-1 text-[10px] uppercase tracking-widest">
              New
            </span>
          )}
          {onSale && (
            <span className="absolute right-3 top-3 bg-clay px-3 py-1 text-[10px] uppercase tracking-widest text-ivory">
              Sale
            </span>
          )}

          <button
            aria-label="Add to wishlist"
            onClick={handleWishlistClick}
            className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-clay text-clay")} />
          </button>
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="font-display text-lg text-charcoal">{product.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            {onSale ? (
              <>
                <span className="text-clay">{formatPKR(product.salePrice!)}</span>
                <span className="text-graphite/50 line-through">{formatPKR(product.price)}</span>
              </>
            ) : (
              <span className="text-graphite">{formatPKR(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
