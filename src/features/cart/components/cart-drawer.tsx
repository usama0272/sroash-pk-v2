"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPKR } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, setOpen, lines, removeLine, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col bg-ivory"
          >
            <div className="flex items-center justify-between border-b border-line p-6">
              <h2 className="font-display text-2xl">Your Bag ({lines.length})</h2>
              <button onClick={() => setOpen(false)} aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {lines.length === 0 ? (
                <p className="text-graphite">Your bag is empty.</p>
              ) : (
                <ul className="space-y-6">
                  {lines.map((line) => (
                    <li key={line.variantId} className="flex gap-4">
                      <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-sand">
                        <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-display text-lg">{line.name}</p>
                          <button onClick={() => removeLine(line.variantId)} aria-label="Remove item">
                            <X className="h-4 w-4 text-graphite" />
                          </button>
                        </div>
                        <p className="text-xs uppercase tracking-wide text-graphite">
                          {line.size} / {line.color}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border border-line">
                            <button
                              className="px-2 py-1"
                              onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm">{line.quantity}</span>
                            <button
                              className="px-2 py-1"
                              onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm">{formatPKR(line.price * line.quantity)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line p-6">
                <div className="mb-4 flex justify-between text-sm">
                  <span className="text-graphite">Subtotal</span>
                  <span>{formatPKR(subtotal())}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="btn-luxury-dark w-full"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
