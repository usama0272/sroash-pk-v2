"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { getPaymentProvider } from "@/features/payments/payment-gateway";
import { checkoutSchema, type CheckoutInput } from "@/features/checkout/validations/checkout.schema";

const SHIPPING_FEE = 350;
const FREE_SHIPPING_THRESHOLD = 15000;

export async function placeOrder(input: CheckoutInput) {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid checkout data." };
  }
  const data = parsed.data;

  const session = await auth();
  let userId: string;

  if (session?.user) {
    userId = session.user.id;
  } else {
    const guestUser = await db.user.upsert({
      where: { email: data.email },
      update: { name: data.fullName, phone: data.phone },
      create: { email: data.email, name: data.fullName, phone: data.phone, role: "CUSTOMER" },
    });
    userId = guestUser.id;
  }

  const variantIds = data.items.map((i) => i.variantId);
  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });
  const variantMap = new Map(variants.map((v) => [v.id, v]));

  let subtotal = 0;
  const orderItemsData: {
    productId: string;
    variantId: string;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
  }[] = [];

  for (const item of data.items) {
    const variant = variantMap.get(item.variantId);
    if (!variant || !variant.product.isActive) {
      return { error: `${item.name} is no longer available.` };
    }
    if (variant.stock < item.quantity) {
      return { error: `Only ${variant.stock} left in stock for ${item.name} (${item.size}/${item.color}).` };
    }
    const unitPrice = variant.product.salePrice ? Number(variant.product.salePrice) : Number(variant.product.price);
    subtotal += unitPrice * item.quantity;
    orderItemsData.push({
      productId: variant.productId,
      variantId: variant.id,
      productName: variant.product.name,
      size: variant.size,
      color: variant.color,
      quantity: item.quantity,
      unitPrice,
    });
  }

  let discount = 0;
  let couponId: string | null = null;
  if (data.couponCode) {
    const coupon = await db.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
    if (!coupon || !coupon.isActive) return { error: "Invalid coupon code." };
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return { error: "This coupon has expired." };
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { error: "This coupon has reached its usage limit." };
    if (coupon.minOrderValue && subtotal < Number(coupon.minOrderValue)) {
      return { error: `Minimum order value for this coupon is PKR ${coupon.minOrderValue}.` };
    }
    discount = coupon.type === "PERCENTAGE" ? subtotal * (Number(coupon.value) / 100) : Number(coupon.value);
    if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));
    couponId = coupon.id;
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const order = await db.$transaction(async (tx) => {
    const address = await tx.address.create({
      data: {
        userId,
        fullName: data.fullName,
        phone: data.phone,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
      },
    });

    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        subtotal,
        shippingFee,
        taxAmount: 0,
        discount,
        total,
        paymentMethod: data.paymentMethod,
        shippingAddressId: address.id,
        couponId,
        items: { create: orderItemsData },
      },
    });

    for (const item of orderItemsData) {
      await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } });
    }
    if (couponId) await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });

    return created;
  });

  const provider = getPaymentProvider(data.paymentMethod);
  const paymentResult = await provider.initiate({
    orderId: order.id,
    orderNumber: order.orderNumber,
    amount: total,
    currency: "PKR",
    customerEmail: data.email,
  });

  if (paymentResult.paymentRef) {
    await db.order.update({ where: { id: order.id }, data: { paymentRef: paymentResult.paymentRef } });
  }
  if (paymentResult.requiresRedirect && paymentResult.redirectUrl) {
    redirect(paymentResult.redirectUrl);
  }
  redirect(`/checkout/success?order=${order.orderNumber}`);
}
