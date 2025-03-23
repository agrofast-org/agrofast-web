import { NextRequest, NextResponse } from "next/server";

// Public paths for user initial access, only accessible if the user has no token
export const PUBLIC_PATHS = [
  "/login",
  "/sign-up",
  "/recover-token",
  "/reset-password",
];
// Paths that require at least a browser agent and a token
export const PUBLIC_AUTH_PATHS = ["/auth-code", "/auth-with"];
// Paths that require authentication
// (browser agent, token, and authenticated cookie)
export const USER_PATHS = ["/", "/dashboard", "/user", "/profile", "/settings"];

export const AUTH_TOKEN_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_token`;
export const AUTHENTICATED_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_authenticated`; // If this cookie is set, the user is authenticated
export const AUTH_BROWSER_AGENT_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_browser_agent`;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasBrowserAgent = request.cookies.has(AUTH_BROWSER_AGENT_KEY);
  const hasToken = request.cookies.has(AUTH_TOKEN_KEY);
  const isAuthenticated = request.cookies.has(AUTHENTICATED_KEY);

  if ((!hasBrowserAgent || !hasToken) && !PUBLIC_PATHS.includes(pathname)) {
    const redirectUrl = new URL(PUBLIC_PATHS[0], request.url);
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (hasBrowserAgent && hasToken && !isAuthenticated && !PUBLIC_AUTH_PATHS.includes(pathname)) {
    const redirectUrl = new URL(PUBLIC_AUTH_PATHS[0], request.url);
    return NextResponse.redirect(redirectUrl.toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
