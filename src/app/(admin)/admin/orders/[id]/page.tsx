import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPKR } from "@/lib/utils";
import { OrderStatusSelect } from "@/features/orders/components/order-status-select";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { user: true, items: true, shippingAddress: true },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl mb-2">{order.orderNumber}</h1>
      <p className="text-graphite mb-8">{order.user.email}</p>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <p className="eyebrow mb-2">Status</p>
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
        <div>
          <p className="eyebrow mb-2">Shipping Address</p>
          <p className="text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-graphite">{order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.province}</p>
          <p className="text-sm text-graphite">{order.shippingAddress.phone}</p>
        </div>
      </div>

      <div className="border border-line bg-ivory divide-y divide-line mb-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between p-4 text-sm">
            <span>{item.productName} ({item.size}/{item.color}) x{item.quantity}</span>
            <span>{formatPKR(Number(item.unitPrice) * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="text-sm space-y-1 max-w-xs ml-auto">
        <div className="flex justify-between"><span className="text-graphite">Subtotal</span><span>{formatPKR(Number(order.subtotal))}</span></div>
        <div className="flex justify-between"><span className="text-graphite">Shipping</span><span>{formatPKR(Number(order.shippingFee))}</span></div>
        {Number(order.discount) > 0 && <div className="flex justify-between"><span className="text-graphite">Discount</span><span>-{formatPKR(Number(order.discount))}</span></div>}
        <div className="flex justify-between font-medium border-t border-line pt-1"><span>Total</span><span>{formatPKR(Number(order.total))}</span></div>
      </div>
    </div>
  );
}
