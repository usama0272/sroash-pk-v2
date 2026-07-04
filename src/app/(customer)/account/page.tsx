import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");
  if (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") redirect("/admin");

  return (
    <div className="container-luxury py-16">
      <h1 className="font-display text-3xl mb-6">My Account</h1>
      <p className="text-graphite">Signed in as {session.user.email}</p>
    </div>
  );
}
