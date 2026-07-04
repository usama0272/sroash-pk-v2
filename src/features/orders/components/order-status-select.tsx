"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/features/orders/actions/order.actions";
import type { OrderStatus } from "@prisma/client";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const [isPending, startTransition] = useTransition();
  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(e) => startTransition(async () => {
        await updateOrderStatus(orderId, e.target.value as OrderStatus);
        toast.success("Order status updated.");
      })}
      className="input-luxury w-48"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
