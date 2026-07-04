import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sroash.pk";
  const [products, categories] = await Promise.all([
    db.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    db.category.findMany({ where: { isActive: true }, select: { slug: true } }),
  ]);

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/collections` },
    { url: `${base}/about` },
    { url: `${base}/faq` },
    ...categories.map((c) => ({ url: `${base}/categories/${c.slug}` })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
