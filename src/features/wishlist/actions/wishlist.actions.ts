"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function toggleWishlist(productId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Please sign in to save items to your wishlist.", needsAuth: true };

  const existing = await db.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/account/wishlist");
    return { wishlisted: false };
  }

  await db.wishlistItem.create({ data: { userId: session.user.id, productId } });
  revalidatePath("/account/wishlist");
  return { wishlisted: true };
}
