import { NextRequest, NextResponse } from "next/server";

// Páginas públicas: acessíveis somente se o usuário NÃO estiver logado
export const PUBLIC_PATHS = [
  "/login",
  "/sign-up",
  "/recover-token",
  "/reset-password",
];

// Páginas de pré-autenticação: requerem token e browser agent, mas o usuário ainda não completou a autenticação
export const PUBLIC_AUTH_PATHS = ["/auth-code", "/auth-with"];

// Páginas protegidas: requerem autenticação completa (token, browser agent e cookie de autenticação)
export const USER_PATHS = ["/", "/dashboard", "/user", "/profile", "/settings"];

export const AUTH_TOKEN_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_token`;
export const AUTHENTICATED_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_authenticated`;
export const AUTH_BROWSER_AGENT_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_browser_agent`;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasBrowserAgent = request.cookies.has(AUTH_BROWSER_AGENT_KEY);
  const hasToken = request.cookies.has(AUTH_TOKEN_KEY);
  const isAuthenticated = request.cookies.has(AUTHENTICATED_KEY);

  if (PUBLIC_PATHS.includes(pathname)) {
    if (hasBrowserAgent && hasToken && isAuthenticated) {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  if (PUBLIC_AUTH_PATHS.includes(pathname)) {
    if (!hasBrowserAgent || !hasToken) {
      const redirectUrl = new URL(PUBLIC_PATHS[0], request.url);
      return NextResponse.redirect(redirectUrl);
    }
    if (isAuthenticated) {
      const redirectUrl = new URL("/", request.url);
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

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
