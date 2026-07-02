"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addLine: (line: CartLine) => void;
  removeLine: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      addLine: (line) =>
        set((state) => {
          const existing = state.lines.find((l) => l.variantId === line.variantId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.variantId === line.variantId
                  ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.stock) }
                  : l
              ),
              isOpen: true,
            };
          }
          return { lines: [...state.lines, line], isOpen: true };
        }),
      removeLine: (variantId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.variantId !== variantId) })),
      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.variantId === variantId
              ? { ...l, quantity: Math.max(1, Math.min(quantity, l.stock)) }
              : l
          ),
        })),
      clear: () => set({ lines: [] }),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      itemCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "sroash-cart" }
  )
);
