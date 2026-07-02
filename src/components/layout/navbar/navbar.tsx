"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingBag, Menu } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { MobileMenu } from "@/components/layout/navbar/mobile-menu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxury",
          scrolled ? "bg-ivory/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(28,26,23,0.08)]" : "bg-transparent"
        )}
      >
        <div className="container-luxury flex h-20 items-center justify-between">
          <button
            aria-label="Open menu"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs uppercase tracking-widest text-charcoal/80 hover:text-charcoal transition-colors duration-300"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-display text-2xl tracking-widest text-charcoal"
          >
            {siteConfig.name}
          </Link>

          <div className="flex items-center gap-5">
            <button aria-label="Search" className="hidden sm:block hover:opacity-60 transition-opacity">
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link href="/account/wishlist" aria-label="Wishlist" className="hidden sm:block hover:opacity-60 transition-opacity">
              <Heart className="h-[18px] w-[18px]" />
            </Link>
            <Link href="/account" aria-label="Account" className="hover:opacity-60 transition-opacity">
              <User className="h-[18px] w-[18px]" />
            </Link>
            <button
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
              className="relative hover:opacity-60 transition-opacity"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[10px] text-ivory"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
