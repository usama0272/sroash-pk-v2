import Link from "next/link";
import { db } from "@/lib/db";
import { formatPKR } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Orders</h1>
      <div className="border border-line bg-ivory">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-sand/30 text-left text-xs uppercase tracking-widest text-graphite">
            <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Payment</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3"><Link href={`/admin/orders/${o.id}`} className="hover:text-clay">{o.orderNumber}</Link></td>
                <td className="px-4 py-3">{o.user.email}</td>
                <td className="px-4 py-3">{formatPKR(Number(o.total))}</td>
                <td className="px-4 py-3">{o.status}</td>
                <td className="px-4 py-3">{o.paymentMethod} / {o.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-8 text-center text-graphite">No orders yet.</p>}
      </div>
    </div>
  );
}
