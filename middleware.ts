import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATH_PREFIX = "/admin";
const CHANGE_PASSWORD_PATH = "/change-password";
const LOGIN_PATH = "/login";

const isProtectedPath = (pathname: string) =>
  pathname.startsWith(ADMIN_PATH_PREFIX) || pathname.startsWith(CHANGE_PASSWORD_PATH);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith(ADMIN_PATH_PREFIX) && token.mustChangePassword) {
    return NextResponse.redirect(new URL(CHANGE_PASSWORD_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/change-password"],
};
