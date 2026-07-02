import "server-only";
import { auth } from "@/lib/auth";
import { roleHasPermission, type PermissionKey } from "@/lib/rbac/permissions";
import type { Role } from "@prisma/client";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Throws if there is no authenticated session. Returns the session otherwise. */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  return session;
}

/** Throws unless the current user's role is one of `roles`. */
export async function requireRole(...roles: Role[]) {
  const session = await requireAuth();
  const role = session.user.role as Role;
  if (!roles.includes(role)) throw new ForbiddenError(`Requires role: ${roles.join(", ")}`);
  return session;
}

/** Throws unless the current user's role grants `permission`. */
export async function requirePermission(permission: PermissionKey) {
  const session = await requireAuth();
  const role = session.user.role as Role;
  if (!roleHasPermission(role, permission)) {
    throw new ForbiddenError(`Missing permission: ${permission}`);
  }
  return session;
}

/** Wraps a server action so RBAC failures become safe {error} results instead of thrown exceptions. */
export function withPermission<Args extends unknown[], Result>(
  permission: PermissionKey,
  fn: (...args: Args) => Promise<Result>
) {
  return async (...args: Args): Promise<Result | { error: string }> => {
    try {
      await requirePermission(permission);
      return await fn(...args);
    } catch (err) {
      if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
        return { error: err.message };
      }
      throw err;
    }
  };
}
