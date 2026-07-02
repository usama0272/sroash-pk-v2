export const siteConfig = {
  name: "SROASH.PK",
  tagline: "Timeless Comfort, Everyday You",
  taglineUrdu: "مدت سے ایک خواب اور میں",
  description:
    "Luxury Pakistani fashion — handcrafted, ready-to-wear, made to order.",
  instagram: "https://instagram.com/sroash.pk",
  instagramHandle: "@sroash.pk",
  currency: "PKR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sroash.pk",
};

export const mainNav = [
  { title: "New Arrivals", href: "/collections/new-arrivals" },
  { title: "Ready to Wear", href: "/categories/ready-to-wear" },
  { title: "Made to Order", href: "/categories/made-to-order" },
  { title: "Collections", href: "/collections" },
  { title: "About", href: "/about" },
];

export const footerNav = {
  shop: [
    { title: "New Arrivals", href: "/collections/new-arrivals" },
    { title: "Best Sellers", href: "/collections/best-sellers" },
    { title: "All Products", href: "/collections" },
  ],
  support: [
    { title: "Track Order", href: "/track-order" },
    { title: "Shipping Policy", href: "/policies/shipping" },
    { title: "Returns & Exchanges", href: "/policies/returns" },
    { title: "FAQ", href: "/faq" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Privacy Policy", href: "/policies/privacy" },
    { title: "Terms of Service", href: "/policies/terms" },
  ],
};
