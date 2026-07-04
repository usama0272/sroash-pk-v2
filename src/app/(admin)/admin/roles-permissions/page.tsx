import { getPermissionsForRole, PERMISSIONS } from "@/lib/rbac/permissions";
import type { Role } from "@prisma/client";

const ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "CUSTOMER"];

export default function RolesPermissionsPage() {
  const allPermissions = Object.values(PERMISSIONS);
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Roles &amp; Permissions</h1>
      <div className="border border-line bg-ivory overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-sand/30 text-left text-xs uppercase tracking-widest text-graphite">
            <tr>
              <th className="px-4 py-3">Permission</th>
              {ROLES.map((r) => <th key={r} className="px-4 py-3 text-center">{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {allPermissions.map((perm) => (
              <tr key={perm} className="border-b border-line last:border-0">
                <td className="px-4 py-3">{perm}</td>
                {ROLES.map((r) => (
                  <td key={r} className="px-4 py-3 text-center">
                    {getPermissionsForRole(r).includes(perm) ? "" : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-graphite">Read-only view. Permission-to-role mapping is defined in code (src/lib/rbac/permissions.ts) for security.</p>
    </div>
  );
}
