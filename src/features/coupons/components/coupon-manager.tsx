"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createCoupon, toggleCoupon } from "@/features/coupons/actions/coupon.actions";

interface Coupon { id: string; code: string; type: string; value: unknown; usedCount: number; usageLimit: number | null; isActive: boolean; }

export function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createCoupon({ code, type, value: parseFloat(value) });
      if (result.error) toast.error(result.error);
      else { toast.success("Coupon created."); setCode(""); setValue(""); }
    });
  }

  return (
    <div className="max-w-2xl space-y-8">
      <form onSubmit={handleCreate} className="space-y-3 border border-line bg-ivory p-6">
        <p className="eyebrow">New Coupon</p>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CODE" className="input-luxury" required />
        <select value={type} onChange={(e) => setType(e.target.value as "PERCENTAGE" | "FIXED")} className="input-luxury">
          <option value="PERCENTAGE">Percentage %</option>
          <option value="FIXED">Fixed Amount (PKR)</option>
        </select>
        <input value={value} onChange={(e) => setValue(e.target.value)} type="number" placeholder="Value" className="input-luxury" required />
        <button disabled={isPending} className="btn-luxury-dark">{isPending ? "Saving..." : "Add Coupon"}</button>
      </form>

      <div className="border border-line bg-ivory divide-y divide-line">
        {coupons.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{c.code}</p>
              <p className="text-xs text-graphite">{c.type === "PERCENTAGE" ? `${c.value}%` : `PKR ${c.value}`} off  used {c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</p>
            </div>
            <button
              onClick={() => startTransition(async () => { await toggleCoupon(c.id, !c.isActive); })}
              className={`text-xs uppercase tracking-wide px-3 py-1 rounded-full ${c.isActive ? "bg-green-100 text-green-700" : "bg-graphite/10 text-graphite"}`}
            >
              {c.isActive ? "Active" : "Disabled"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
