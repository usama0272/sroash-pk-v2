import { db } from "@/lib/db";
import { formatPKR } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
  const [totalRevenue, orderCount, topProducts, categoryBreakdown] = await Promise.all([
    db.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    db.order.count(),
    db.orderItem.groupBy({ by: ["productName"], _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 5 }),
    db.category.findMany({ include: { _count: { select: { products: true } } } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Analytics</h1>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="border border-line bg-ivory p-6">
          <p className="text-xs uppercase tracking-widest text-graphite">Total Revenue (Paid)</p>
          <p className="mt-2 font-display text-3xl">{formatPKR(Number(totalRevenue._sum.total ?? 0))}</p>
        </div>
        <div className="border border-line bg-ivory p-6">
          <p className="text-xs uppercase tracking-widest text-graphite">Total Orders</p>
          <p className="mt-2 font-display text-3xl">{orderCount}</p>
        </div>
      </div>

      <h2 className="font-display text-xl mb-4">Top Selling Products</h2>
      <div className="border border-line bg-ivory divide-y divide-line mb-10">
        {topProducts.map((p) => (
          <div key={p.productName} className="flex justify-between p-4 text-sm">
            <span>{p.productName}</span><span>{p._sum.quantity} sold</span>
          </div>
        ))}
        {topProducts.length === 0 && <p className="p-4 text-graphite text-sm">No sales data yet.</p>}
      </div>

      <h2 className="font-display text-xl mb-4">Products by Category</h2>
      <div className="border border-line bg-ivory divide-y divide-line">
        {categoryBreakdown.map((c) => (
          <div key={c.id} className="flex justify-between p-4 text-sm">
            <span>{c.name}</span><span>{c._count.products} products</span>
          </div>
        ))}
      </div>
    </div>
  );
}
