"use client";

import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { formatPKR } from "@/lib/utils";

export default function CheckoutPage() {
  const { lines, subtotal } = useCartStore();

  return (
    <div className="container-luxury py-16">
      <h1 className="font-display text-4xl mb-10">Checkout</h1>
      <div className="grid gap-16 lg:grid-cols-[1fr_400px]">
        <CheckoutForm />

        <div className="h-fit border border-line p-6">
          <h2 className="font-display text-xl mb-6">Order Summary</h2>
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={line.variantId} className="flex gap-3">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-sand">
                  <Image src={line.image} alt={line.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 text-sm">
                  <p>{line.name}</p>
                  <p className="text-xs text-graphite">
                    {line.size}/{line.color} × {line.quantity}
                  </p>
                </div>
                <span className="text-sm">{formatPKR(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between border-t border-line pt-4 text-sm">
            <span className="text-graphite">Subtotal</span>
            <span>{formatPKR(subtotal())}</span>
          </div>
          <p className="mt-1 text-xs text-graphite/70">
            Shipping and any coupon discount are applied when you place the order.
          </p>
        </div>
      </div>
    </div>
  );
}
