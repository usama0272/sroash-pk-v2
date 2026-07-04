"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requirePermission, UnauthorizedError, ForbiddenError } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { productSchema, type ProductInput } from "@/features/products/validations/product.schema";

async function logAudit(userId: string, action: string, entity: string, entityId?: string, meta?: object) {
  await db.auditLog.create({ data: { userId, action, entity, entityId, meta } });
}

function handleDbError(err: unknown): { error: string } {
  if (err instanceof UnauthorizedError || err instanceof ForbiddenError) return { error: err.message };
  if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
    const meta = "meta" in err ? (err.meta as { target?: string[] } | undefined) : undefined;
    const field = meta?.target?.join(", ") ?? "field";
    return { error: `A product or variant with this ${field} already exists. Try a different SKU or slug.` };
  }
  console.error("Product save error:", err);
  return { error: "Something went wrong while saving. Please try again." };
}

export async function createProduct(input: ProductInput) {
  try {
    const session = await requirePermission(PERMISSIONS.PRODUCTS_CREATE);
    const parsed = productSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid product data." };
    const data = parsed.data;

    const existingSlug = await db.product.findUnique({ where: { slug: data.slug } });
    if (existingSlug) return { error: "A product with this slug already exists." };

    const product = await db.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        fabric: data.fabric,
        careInstructions: data.careInstructions,
        sku: data.sku,
        price: data.price,
        salePrice: data.salePrice ?? null,
        heroImage: data.heroImage,
        sizeChart: data.sizeChart ?? null,
        gallery: data.gallery,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isActive: data.isActive,
        isMadeToOrder: data.isMadeToOrder,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        tags: data.tags,
        createdById: session.user.id,
        variants: { create: data.variants },
      },
    });

    await logAudit(session.user.id, "CREATE", "Product", product.id, { name: product.name });
    revalidatePath("/admin/products");
    revalidatePath("/collections");
    return { data: product };
  } catch (err) {
    return handleDbError(err);
  }
}

export async function updateProduct(id: string, input: ProductInput) {
  try {
    const session = await requirePermission(PERMISSIONS.PRODUCTS_EDIT);
    const parsed = productSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid product data." };
    const data = parsed.data;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return { error: "Product not found." };

    const slugConflict = await db.product.findFirst({ where: { slug: data.slug, id: { not: id } } });
    if (slugConflict) return { error: "Another product already uses this slug." };

    await db.$transaction([
      db.productVariant.deleteMany({ where: { productId: id } }),
      db.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          fabric: data.fabric,
          careInstructions: data.careInstructions,
          sku: data.sku,
          price: data.price,
          salePrice: data.salePrice ?? null,
          heroImage: data.heroImage,
          sizeChart: data.sizeChart ?? null,
          gallery: data.gallery,
          categoryId: data.categoryId,
          isFeatured: data.isFeatured,
          isNewArrival: data.isNewArrival,
          isActive: data.isActive,
          isMadeToOrder: data.isMadeToOrder,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          tags: data.tags,
          variants: { create: data.variants },
        },
      }),
    ]);

    await logAudit(session.user.id, "UPDATE", "Product", id, { name: data.name });
    revalidatePath("/admin/products");
    revalidatePath(`/products/${data.slug}`);
    return { data: { id } };
  } catch (err) {
    return handleDbError(err);
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await requirePermission(PERMISSIONS.PRODUCTS_DELETE);
    const product = await db.product.findUnique({ where: { id } });
    if (!product) return { error: "Product not found." };

    await db.product.update({ where: { id }, data: { isActive: false } });

    await logAudit(session.user.id, "DELETE", "Product", id, { name: product.name });
    revalidatePath("/admin/products");
    return { data: { id } };
  } catch (err) {
    return handleDbError(err);
  }
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  try {
    const session = await requirePermission(PERMISSIONS.PRODUCTS_EDIT);
    await db.product.update({ where: { id }, data: { isActive } });
    await logAudit(session.user.id, isActive ? "ACTIVATE" : "DEACTIVATE", "Product", id);
    revalidatePath("/admin/products");
    return { data: { id, isActive } };
  } catch (err) {
    return handleDbError(err);
  }
}
