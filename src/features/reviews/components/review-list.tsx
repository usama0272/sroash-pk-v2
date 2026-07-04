"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Check, Trash2 } from "lucide-react";
import { approveReview, deleteReview } from "@/features/reviews/actions/review.actions";

interface ReviewRow { id: string; rating: number; title: string | null; comment: string; isApproved: boolean; user: { name: string | null; email: string }; product: { name: string }; }

export function ReviewList({ reviews }: { reviews: ReviewRow[] }) {
  const [isPending, startTransition] = useTransition();

  if (reviews.length === 0) return <p className="text-graphite">No reviews yet.</p>;

  return (
    <div className="border border-line bg-ivory divide-y divide-line">
      {reviews.map((r) => (
        <div key={r.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-graphite">{r.product.name}  {r.user.name ?? r.user.email}</p>
              <p className="font-medium">{r.title || `${r.rating} stars`}</p>
              <p className="text-sm text-graphite mt-1">{r.comment}</p>
            </div>
            <div className="flex gap-3 shrink-0 ml-4">
              {!r.isApproved && (
                <button disabled={isPending} onClick={() => startTransition(async () => { await approveReview(r.id); toast.success("Review approved."); })} aria-label="Approve">
                  <Check className="h-4 w-4 text-green-600" />
                </button>
              )}
              <button disabled={isPending} onClick={() => startTransition(async () => { await deleteReview(r.id); toast.success("Review deleted."); })} aria-label="Delete">
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
