"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { productSchema, type ProductInput } from "@/features/products/validations/product.schema";
import { createProduct, updateProduct } from "@/features/products/actions/product.actions";
import { ImageUploadField } from "@/features/media/components/image-upload-field";
import { slugify } from "@/lib/utils";
import type { Category } from "@prisma/client";

export function ProductForm({
  categories,
  defaultValues,
  productId,
}: {
  categories: Category[];
  defaultValues?: Partial<ProductInput>;
  productId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      gallery: [],
      tags: [],
      variants: [{ size: "", color: "", sku: "", stock: 0 }],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });
  const heroImage = watch("heroImage");
  const name = watch("name");

  function onSubmit(values: ProductInput) {
    startTransition(async () => {
      const result = productId ? await updateProduct(productId, values) : await createProduct(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(productId ? "Product updated." : "Product created.");
        router.push("/admin/products");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-10">
      <section className="space-y-4">
        <h2 className="eyebrow">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Name</label>
            <input
              {...register("name")}
              onBlur={(e) => {
                if (!productId) setValue("slug", slugify(e.target.value));
              }}
              className="input-luxury"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Slug</label>
            <input {...register("slug")} className="input-luxury" />
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">SKU</label>
            <input {...register("sku")} className="input-luxury" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Category</label>
            <select {...register("categoryId")} className="input-luxury">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Price (PKR)</label>
            <input type="number" step="0.01" {...register("price")} className="input-luxury" />
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Sale Price (optional)</label>
            <input type="number" step="0.01" {...register("salePrice")} className="input-luxury" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Description</label>
          <textarea {...register("description")} rows={5} className="input-luxury" />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Fabric</label>
            <input {...register("fabric")} className="input-luxury" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">Care Instructions</label>
            <input {...register("careInstructions")} className="input-luxury" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="eyebrow">Images</h2>
        <ImageUploadField
          label="Hero Image"
          value={heroImage ?? null}
          onChange={(url) => setValue("heroImage", url ?? "")}
        />
        {errors.heroImage && <p className="text-xs text-red-600">{errors.heroImage.message}</p>}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="eyebrow">Variants (Size / Color / Stock)</h2>
          <button
            type="button"
            onClick={() => append({ size: "", color: "", sku: "", stock: 0 })}
            className="flex items-center gap-1 text-xs uppercase tracking-wide hover:text-clay"
          >
            <Plus className="h-3.5 w-3.5" /> Add Variant
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end">
              <div>
                <label className="mb-1 block text-[10px] uppercase text-graphite">Size</label>
                <input {...register(`variants.${index}.size`)} className="input-luxury" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-graphite">Color</label>
                <input {...register(`variants.${index}.color`)} className="input-luxury" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-graphite">SKU</label>
                <input {...register(`variants.${index}.sku`)} className="input-luxury" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-graphite">Stock</label>
                <input type="number" {...register(`variants.${index}.stock`)} className="input-luxury" />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="mb-2 text-graphite hover:text-red-600 disabled:opacity-30"
                aria-label="Remove variant"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {errors.variants && <p className="text-xs text-red-600">{errors.variants.message as string}</p>}
      </section>

      <section className="space-y-4">
        <h2 className="eyebrow">Flags</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isFeatured")} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isNewArrival")} /> New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isMadeToOrder")} /> Made to Order
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isActive")} /> Active
          </label>
        </div>
      </section>

      <button type="submit" disabled={isPending} className="btn-luxury-dark">
        {isPending ? "Saving..." : productId ? "Update Product" : `Create ${name || "Product"}`}
      </button>
    </form>
  );
}
