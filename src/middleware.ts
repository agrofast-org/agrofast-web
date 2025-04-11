import { NextRequest, NextResponse } from "next/server";

export const PUBLIC_PATHS = [
  "/login",
  "/sign-up",
  "/recover-token",
  "/reset-password",
];
export const PUBLIC_AUTH_PATHS = ["/auth-code", "/auth-with"];

export const AUTH_TOKEN_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_token`;
export const AUTHENTICATED_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_authenticated`;
export const AUTH_BROWSER_AGENT_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_browser_agent`;

const publicMatcher = [
  "/img/",
  "/favicon.ico",
  "/api",
  "/static",
  "/robots.txt",
];

const metaMatcher = [
  "/_next/static",
  "/_next/image",
  "/api",
  "/sitemap.xml",
  "/sitemap-index.xml",
];

const log = (request: NextRequest) => {
  const { method, nextUrl, headers } = request;
  const ip = request.headers.get("x-forwarded-for") ?? "unknown IP";

  const logMessage = `${ip} [${method}] ${nextUrl.pathname} - ${
    headers.get("user-agent") ?? "unknown agent"
  }`;
  console.log(logMessage);
};

export function middleware(request: NextRequest) {
  if (metaMatcher.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  log(request);
  if (publicMatcher.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  if (host.startsWith("/web")) {
    const hasBrowserAgent = request.cookies.has(AUTH_BROWSER_AGENT_KEY);
    const hasToken = request.cookies.has(AUTH_TOKEN_KEY);
    const isAuthenticated = request.cookies.has(AUTHENTICATED_KEY);

    if (PUBLIC_AUTH_PATHS.includes(pathname)) {
      if (!hasBrowserAgent || !hasToken) {
        const redirectUrl = new URL(PUBLIC_PATHS[0], request.url);
        return NextResponse.redirect(redirectUrl);
      }
      if (isAuthenticated) {
        const redirectUrl = new URL("/web", request.url);
        return NextResponse.redirect(redirectUrl);
      }
      return NextResponse.next();
    }

    if (!hasBrowserAgent || !hasToken) {
      const redirectUrl = new URL(PUBLIC_PATHS[0], request.url);
      return NextResponse.redirect(redirectUrl);
    }
    if (!isAuthenticated) {
      const redirectUrl = new URL(PUBLIC_AUTH_PATHS[0], request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
