"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = use(searchParams);
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-luxury flex min-h-[70vh] flex-col items-center justify-center text-center py-24">
      <CheckCircle2 className="h-14 w-14 text-clay" />
      <h1 className="mt-6 font-display text-4xl">Order Confirmed</h1>
      {orderNumber && <p className="mt-2 text-graphite">Order Number: {orderNumber}</p>}
      <p className="mt-4 max-w-md text-graphite">
        Thank you for shopping with SROASH.PK. We&apos;ll email you as soon as your order ships.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/account/orders" className="btn-luxury-outline">
          Track Order
        </Link>
        <Link href="/collections" className="btn-luxury-dark">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
