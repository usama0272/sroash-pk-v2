"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, EyeOff, Eye } from "lucide-react";
import { deleteProduct, toggleProductStatus } from "@/features/products/actions/product.actions";

export function ProductRowActions({ productId, isActive }: { productId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleProductStatus(productId, !isActive);
      if (result?.error) toast.error(result.error);
      else toast.success(isActive ? "Product hidden from storefront." : "Product is now active.");
    });
  }

  function handleDelete() {
    if (!confirm("Remove this product? It will be hidden from the storefront but order history is kept.")) return;
    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result?.error) toast.error(result.error);
      else toast.success("Product removed.");
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Link href={`/admin/products/${productId}/edit`} aria-label="Edit product" className="hover:text-clay">
        <Pencil className="h-4 w-4" />
      </Link>
      <button onClick={handleToggle} disabled={isPending} aria-label="Toggle status" className="hover:text-clay">
        {isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <button onClick={handleDelete} disabled={isPending} aria-label="Delete product" className="hover:text-red-600">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
