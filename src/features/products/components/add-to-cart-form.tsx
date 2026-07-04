"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn, formatPKR } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import type { ProductVariant } from "@prisma/client";

import { SizeChartModal } from "@/features/products/components/size-chart-modal";

interface Props {
  sizeChartUrl?: string | null;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  variants: ProductVariant[];
}

export function AddToCartForm({ productId, slug, name, image, price, variants, sizeChartUrl }: Props) {
  const sizes = useMemo(() => Array.from(new Set(variants.map((v) => v.size))), [variants]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const colorsForSize = useMemo(
    () => variants.filter((v) => v.size === selectedSize),
    [variants, selectedSize]
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const addLine = useCartStore((s) => s.addLine);

  function handleAddToCart() {
    if (!selectedVariant) {
      toast.error("Please select size and color.");
      return;
    }
    if (selectedVariant.stock < 1) {
      toast.error("This variant is out of stock.");
      return;
    }

    addLine({
      variantId: selectedVariant.id,
      productId,
      slug,
      name,
      image,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price,
      quantity: 1,
      stock: selectedVariant.stock,
    });
    toast.success("Added to bag.");
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="eyebrow">Size</p>
          {sizeChartUrl && <SizeChartModal imageUrl={sizeChartUrl} />}
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => {
                setSelectedSize(size);
                setSelectedColor(null);
              }}
              className={cn(
                "h-11 min-w-[44px] border px-3 text-xs uppercase tracking-wide transition-colors",
                selectedSize === size
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-line hover:border-charcoal"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {selectedSize && (
        <div>
          <p className="eyebrow mb-3">Color</p>
          <div className="flex flex-wrap gap-2">
            {colorsForSize.map((v) => (
              <button
                key={v.id}
                disabled={v.stock < 1}
                onClick={() => setSelectedColor(v.color)}
                className={cn(
                  "h-11 border px-4 text-xs uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  selectedColor === v.color
                    ? "border-charcoal bg-charcoal text-ivory"
                    : "border-line hover:border-charcoal"
                )}
              >
                {v.color} {v.stock < 1 && "(Out of stock)"}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleAddToCart} className="btn-luxury-dark w-full">
        Add to Bag — {formatPKR(price)}
      </button>
    </div>
  );
}
