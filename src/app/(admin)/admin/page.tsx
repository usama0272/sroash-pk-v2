import { db } from "@/lib/db";
import { formatPKR } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, pendingOrders, revenue] = await Promise.all([
    db.product.count({ where: { isActive: true } }),
    db.order.count(),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
  ]);

  const stats = [
    { label: "Active Products", value: productCount },
    { label: "Total Orders", value: orderCount },
    { label: "Pending Orders", value: pendingOrders },
    { label: "Revenue (Paid)", value: formatPKR(Number(revenue._sum.total ?? 0)) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-line bg-ivory p-6">
            <p className="text-xs uppercase tracking-widest text-graphite">{stat.label}</p>
            <p className="mt-2 font-display text-3xl">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
