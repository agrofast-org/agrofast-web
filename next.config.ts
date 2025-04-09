import type { NextConfig } from "next";

const portfolioHost = new URL(
  process.env.NEXT_PUBLIC_PORTFOLIO_BASE_URL as string
).host;
const appHost = new URL(process.env.NEXT_PUBLIC_WEB_BASE_URL as string).host;
const legalHost = new URL(process.env.NEXT_PUBLIC_LEGAL_BASE_URL as string).host;
const apiHost = new URL(process.env.NEXT_PUBLIC_API_BASE_URL as string).host;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: legalHost,
          },
        ],
        destination: "/legal/:path*",
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: portfolioHost,
          },
        ],
        destination: "/portfolio/:path*",
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: appHost,
          },
        ],
        destination: "/web/:path*",
      },
    ];
  },
  i18n: {
    locales: ["pt-BR", "en", "es"],
    defaultLocale: "pt-BR",
  },
  images: {
    domains: [apiHost],
    remotePatterns: [
      {
        protocol: "https",
        hostname: apiHost,
        port: "",
        pathname: "/*/**",
        search: "",
      },
      {
        protocol: "http",
        hostname: apiHost,
        port: "",
        pathname: "/*/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
