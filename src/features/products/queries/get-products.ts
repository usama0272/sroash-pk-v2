import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export interface ProductFilters {
  categorySlug?: string;
  featured?: boolean;
  newArrival?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
  pageSize?: number;
}

export async function getProducts(filters: ProductFilters = {}) {
  const { categorySlug, featured, newArrival, minPrice, maxPrice, sizes, colors, sort = "newest", page = 1, pageSize = 12 } = filters;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(featured !== undefined && { isFeatured: featured }),
    ...(newArrival !== undefined && { isNewArrival: newArrival }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: { ...(minPrice !== undefined && { gte: minPrice }), ...(maxPrice !== undefined && { lte: maxPrice }) },
    }),
    ...((sizes?.length || colors?.length) && {
      variants: { some: { ...(sizes?.length && { size: { in: sizes } }), ...(colors?.length && { color: { in: colors } }) } },
    }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc" ? { price: "asc" } : sort === "price-desc" ? { price: "desc" } : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    db.product.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize, include: { category: true, variants: true } }),
    db.product.count({ where }),
  ]);

  return { products, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      variants: true,
      reviews: { where: { isApproved: true }, include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  return db.product.findMany({ where: { categoryId, isActive: true, id: { not: excludeId } }, include: { variants: true }, take, orderBy: { createdAt: "desc" } });
}

export async function getFeaturedProducts(take = 8) {
  const featured = await db.product.findMany({ where: { isActive: true, isFeatured: true }, include: { variants: true }, take, orderBy: { createdAt: "desc" } });
  if (featured.length > 0) return featured;
  // Fallback: no products flagged featured yet, show the latest active ones instead.
  return db.product.findMany({ where: { isActive: true }, include: { variants: true }, take, orderBy: { createdAt: "desc" } });
}
