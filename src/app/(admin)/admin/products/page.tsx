import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { formatPKR } from "@/lib/utils";
import { ProductRowActions } from "@/features/products/components/product-row-actions";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const products = await db.product.findMany({
    where: q
      ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] }
      : undefined,
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Products</h1>
        <Link href="/admin/products/new" className="btn-luxury-dark">
          <Plus className="h-4 w-4" /> New Product
        </Link>
      </div>

      <form className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name or SKU..."
          className="input-luxury max-w-sm"
        />
      </form>

      <div className="overflow-x-auto border border-line bg-ivory">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-sand/30 text-left text-xs uppercase tracking-widest text-graphite">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={product.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-9 shrink-0 bg-sand bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.heroImage})` }}
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-graphite">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.category.name}</td>
                  <td className="px-4 py-3">{formatPKR(Number(product.price))}</td>
                  <td className="px-4 py-3">
                    <span className={totalStock < 5 ? "text-red-600" : ""}>{totalStock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wide ${
                        product.isActive ? "bg-green-100 text-green-700" : "bg-graphite/10 text-graphite"
                      }`}
                    >
                      {product.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ProductRowActions productId={product.id} isActive={product.isActive} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-graphite">No products found.</p>}
      </div>
    </div>
  );
}
