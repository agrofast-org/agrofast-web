import type { NextConfig } from "next";

const apiHost = new URL(process.env.NEXT_PUBLIC_API_BASE_URL as string).host;

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
  async headers() {
    return [
      {
        source: "/web/login",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
