import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user.role;

  if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex min-h-screen bg-sand/20">
      <AdminSidebar role={role} />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line bg-ivory px-8 py-4">
          <p className="text-sm text-graphite">
            Signed in as <span className="text-charcoal">{session.user.email}</span>
          </p>
          <span className="rounded-full bg-charcoal px-3 py-1 text-[10px] uppercase tracking-widest text-ivory">
            {role}
          </span>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
