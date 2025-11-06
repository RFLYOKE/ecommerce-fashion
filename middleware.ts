import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

type RoleObject = { name?: string; slug?: string; role?: string };
type RoleShape = string | RoleObject;
type TokenWithRoles = JWT & { roles?: RoleShape[] };

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set(
    "callbackUrl",
    req.nextUrl.pathname + req.nextUrl.search
  );
  return NextResponse.redirect(url);
}

function redirectCustomer(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set(
    "callbackUrl",
    req.nextUrl.pathname + req.nextUrl.search
  );
  return NextResponse.redirect(url);
}

const roleName = (r: RoleShape): string =>
  typeof r === "string" ? r : r.name ?? r.slug ?? r.role ?? "";

const isSuperadmin = (roles?: RoleShape[]): boolean =>
  Array.isArray(roles) &&
  roles.some((r) => roleName(r).toLowerCase() === "superadmin");

const isAdmin = (roles?: RoleShape[]): boolean =>
  Array.isArray(roles) &&
  roles.some((r) => roleName(r).toLowerCase() === "admin");

export async function middleware(req: NextRequest) {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as TokenWithRoles | null;

  const pathname = req.nextUrl.pathname;

  if (!token) {
    if (pathname === "/me") {
      return redirectCustomer(req);
    }
    return redirectToLogin(req);
  }

  // This logic applies only to the /admin/* path
  if (pathname.startsWith("/admin") && !isSuperadmin(token.roles) && !isAdmin(token.roles)) {
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/me"],
};