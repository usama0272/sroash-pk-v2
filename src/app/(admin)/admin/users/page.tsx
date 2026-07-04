import { db } from "@/lib/db";
import { UserTable } from "@/features/users/components/user-table";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Users</h1>
      <UserTable users={users} />
    </div>
  );
}
