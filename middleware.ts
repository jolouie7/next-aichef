import { type NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/create-meal",
  "/meal-detail",
  "/meal-image",
  "/meal-results",
  "/my-meals",
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const path = request.nextUrl.pathname;

  // Redirect unauthenticated users to signin
  if (!isAuthenticated && protectedRoutes.includes(path)) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
