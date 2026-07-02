"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPKR } from "@/lib/utils";

export default function CartPage() {
  const { lines, removeLine, updateQuantity, subtotal } = useCartStore();

  if (lines.length === 0) {
    return (
      <div className="container-luxury py-24 text-center">
        <h1 className="font-display text-4xl">Your Bag is Empty</h1>
        <Link href="/collections" className="btn-luxury-dark mt-8 inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxury py-16">
      <h1 className="font-display text-4xl mb-10">Your Bag</h1>
      <div className="grid gap-14 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-line">
          {lines.map((line) => (
            <li key={line.variantId} className="flex gap-6 py-6">
              <div className="relative h-36 w-28 shrink-0 overflow-hidden bg-sand">
                <Image src={line.image} alt={line.name} fill className="object-cover" sizes="112px" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <Link href={`/products/${line.slug}`} className="font-display text-xl hover:text-clay">
                    {line.name}
                  </Link>
                  <button onClick={() => removeLine(line.variantId)} aria-label="Remove item">
                    <X className="h-4 w-4 text-graphite" />
                  </button>
                </div>
                <p className="mt-1 text-xs uppercase tracking-wide text-graphite">
                  {line.size} / {line.color}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center border border-line">
                    <button
                      className="px-3 py-1.5"
                      onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-4 text-sm">{line.quantity}</span>
                    <button
                      className="px-3 py-1.5"
                      onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span>{formatPKR(line.price * line.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit border border-line p-6">
          <h2 className="font-display text-2xl mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm text-graphite">
            <span>Subtotal</span>
            <span>{formatPKR(subtotal())}</span>
          </div>
          <p className="mt-1 text-xs text-graphite/70">Shipping & taxes calculated at checkout.</p>
          <Link href="/checkout" className="btn-luxury-dark mt-6 w-full">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
