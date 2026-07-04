"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateUserRole, toggleUserActive } from "@/features/users/actions/user.actions";
import type { Role } from "@prisma/client";

interface UserRow { id: string; name: string | null; email: string; role: Role; isActive: boolean; }

export function UserTable({ users }: { users: UserRow[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border border-line bg-ivory">
      <table className="w-full text-sm">
        <thead className="border-b border-line bg-sand/30 text-left text-xs uppercase tracking-widest text-graphite">
          <tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-line last:border-0">
              <td className="px-4 py-3">
                <p>{u.name ?? ""}</p>
                <p className="text-xs text-graphite">{u.email}</p>
              </td>
              <td className="px-4 py-3">
                <select
                  defaultValue={u.role}
                  disabled={isPending}
                  onChange={(e) => startTransition(async () => {
                    await updateUserRole(u.id, e.target.value as Role);
                    toast.success("Role updated.");
                  })}
                  className="input-luxury w-40"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <button
                  disabled={isPending}
                  onClick={() => startTransition(async () => {
                    await toggleUserActive(u.id, !u.isActive);
                    toast.success(u.isActive ? "User suspended." : "User activated.");
                  })}
                  className={`text-xs uppercase tracking-wide px-3 py-1 rounded-full ${u.isActive ? "bg-green-100 text-green-700" : "bg-graphite/10 text-graphite"}`}
                >
                  {u.isActive ? "Active" : "Suspended"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
