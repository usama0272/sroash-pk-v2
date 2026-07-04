import { db } from "@/lib/db";
import { ReviewList } from "@/features/reviews/components/review-list";

export default async function AdminReviewsPage() {
  const reviews = await db.review.findMany({
    include: { user: true, product: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Reviews</h1>
      <ReviewList reviews={reviews} />
    </div>
  );
}
