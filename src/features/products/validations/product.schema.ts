import { z } from "zod";

export const productVariantSchema = z.object({
  size: z.string().min(1),
  color: z.string().min(1),
  colorHex: z.string().optional(),
  sku: z.string().min(1),
  stock: z.coerce.number().int().min(0),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description is required"),
  fabric: z.string().optional(),
  careInstructions: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  salePrice: z.coerce.number().positive().optional().nullable(),
  heroImage: z.string().url("Hero image is required"),
  gallery: z.array(z.string().url()).default([]),
  categoryId: z.string().min(1, "Category is required"),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isMadeToOrder: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
  variants: z.array(productVariantSchema).min(1, "Add at least one variant"),
});

export type ProductInput = z.infer<typeof productSchema>;
