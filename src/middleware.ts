import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);
const SUPER_ADMIN_ONLY_PREFIXES = ["/admin/users", "/admin/roles-permissions", "/admin/settings"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAccountRoute = nextUrl.pathname.startsWith("/account");

  if (isAdminRoute) {
    if (!isLoggedIn || !role || !ADMIN_ROLES.has(role)) {
      const loginUrl = new URL("/login", nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isSuperAdminOnly = SUPER_ADMIN_ONLY_PREFIXES.some((p) => nextUrl.pathname.startsWith(p));
    if (isSuperAdminOnly && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", nextUrl.origin));
    }
  }

  if (isAccountRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
