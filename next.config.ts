import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n: {
    locales: ["pt-BR", "en", "es"],
    defaultLocale: "pt-BR",
  },
  images: {
    domains: ["local.api.agrofast.tech", process.env.NEXT_PUBLIC_API_BASE_URL ?? "api.agrofast.tech"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_API_BASE_URL ?? "api.agrofast.tech",
        port: "",
        pathname: "/*/**",
        search: "",
      },
      {
        protocol: "http",
        hostname:
          process.env.NEXT_PUBLIC_API_BASE_URL ?? "local.api.agrofast.tech",
        port: "",
        pathname: "/*/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
