"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { placeOrder } from "@/features/checkout/actions/place-order.action";
import { formatPKR } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  line1: z.string().min(4, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postalCode: z.string().optional(),
  paymentMethod: z.enum(["COD"]),
  couponCode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PAYMENT_OPTIONS: { value: FormValues["paymentMethod"]; label: string }[] = [
  { value: "COD", label: "Cash on Delivery" },
];

export function CheckoutForm() {
  const { lines, subtotal } = useCartStore();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { paymentMethod: "COD" },
  });

  function onSubmit(values: FormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await placeOrder({
        ...values,
        items: lines.map((l) => ({
          variantId: l.variantId,
          productId: l.productId,
          quantity: l.quantity,
          price: l.price,
          size: l.size,
          color: l.color,
          name: l.name,
        })),
      });
      if (result?.error) {
        setServerError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section>
        <h2 className="eyebrow mb-4">Contact & Shipping</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" error={errors.fullName?.message}>
            <input {...register("fullName")} className="input-luxury" />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <input {...register("phone")} className="input-luxury" />
          </Field>
          <Field label="Email" error={errors.email?.message} full>
            <input {...register("email")} type="email" className="input-luxury" />
          </Field>
          <Field label="Address" error={errors.line1?.message} full>
            <input {...register("line1")} className="input-luxury" />
          </Field>
          <Field label="Apartment, suite, etc. (optional)" full>
            <input {...register("line2")} className="input-luxury" />
          </Field>
          <Field label="City" error={errors.city?.message}>
            <input {...register("city")} className="input-luxury" />
          </Field>
          <Field label="Province" error={errors.province?.message}>
            <input {...register("province")} className="input-luxury" />
          </Field>
          <Field label="Postal Code (optional)">
            <input {...register("postalCode")} className="input-luxury" />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="eyebrow mb-4">Payment Method</h2>
        <div className="space-y-2">
          {PAYMENT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 border border-line px-4 py-3 cursor-pointer has-[:checked]:border-charcoal"
            >
              <input type="radio" value={opt.value} {...register("paymentMethod")} />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="eyebrow mb-4">Coupon Code</h2>
        <input {...register("couponCode")} placeholder="Enter code" className="input-luxury" />
      </section>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button type="submit" disabled={isPending || lines.length === 0} className="btn-luxury-dark w-full">
        {isPending ? "Placing Order..." : `Place Order — ${formatPKR(subtotal())}`}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="mb-1.5 block text-xs uppercase tracking-wide text-graphite">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

