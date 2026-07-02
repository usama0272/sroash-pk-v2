import "server-only";
import { db } from "@/lib/db";
import { siteConfig } from "@/config/site";

interface HeroData {
  image: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
}

const DEFAULT_HERO: HeroData = {
  image: "/images/hero.jpg",
  headline: "Timeless Comfort, Everyday You",
  subheadline:
    "Handcrafted ready-to-wear and made-to-order pieces, designed for the way you actually live.",
  ctaLabel: "Shop New Arrivals",
  ctaHref: "/collections/new-arrivals",
};

export async function getHeroData(): Promise<HeroData> {
  const section = await db.cmsSection.findUnique({ where: { key: "homepage_hero" } });
  if (!section) return DEFAULT_HERO;
  return { ...DEFAULT_HERO, ...(section.data as Partial<HeroData>) };
}

export async function getActiveTestimonials() {
  return db.testimonial.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
}

export async function getActiveInstagramPosts() {
  return db.instagramPost.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
}

export { siteConfig };
