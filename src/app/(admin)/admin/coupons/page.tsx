import { db } from "@/lib/db";
import { CouponManager } from "@/features/coupons/components/coupon-manager";

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Coupons</h1>
      <CouponManager coupons={coupons} />
    </div>
  );
}
