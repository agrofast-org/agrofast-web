import { NextRequest, NextResponse } from "next/server";

export const PUBLIC_PATHS = [
  "/login",
  "/sign-up",
  "/recover-token",
  "/reset-password",
];
export const PUBLIC_AUTH_PATHS = ["/auth-code", "/auth-with"];
export const USER_PATHS = ["/", "/dashboard", "/user", "/profile", "/settings"];

export const AUTH_TOKEN_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_token`;
export const AUTHENTICATED_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_authenticated`;
export const AUTH_BROWSER_AGENT_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_browser_agent`;

export function middleware(request: NextRequest) {
  const hasBrowserAgent = request.cookies.has(AUTH_BROWSER_AGENT_KEY);
  const hasToken = request.cookies.has(AUTH_TOKEN_KEY);

  const hasToAuthenticate = request.cookies.has(AUTHENTICATED_KEY);

  const pathname = request.nextUrl.pathname;

  if ((!hasBrowserAgent || !hasToken) && !PUBLIC_PATHS.includes(pathname)) {
    const url = new URL(PUBLIC_PATHS[0], request.url);
    return NextResponse.redirect(url.toString());
  }

  if (hasBrowserAgent && hasToken && hasToAuthenticate && !PUBLIC_AUTH_PATHS.includes(pathname)) {
    const url = new URL(PUBLIC_AUTH_PATHS[0], request.url);
    return NextResponse.redirect(url.toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
