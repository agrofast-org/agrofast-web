import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numberInputMask(value: string | undefined): string {
  if (value === undefined || value === null || value.trim() === "") {
    return "";
  }
  return value
    .substring(0, 19)
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3")
    .replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
    .replace(/^(\d{2})(\d{2})(\d{4})(\d{4})$/, "+$1 ($2) $3-$4")
    .replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, "+$1 ($2) $3-$4");
}

export const isNumeric = (key: string): boolean => /^\d+$/.test(key);

export const isDev = (): boolean => {
  return process.env.NODE_ENV === "development";
};

export const getPortfolioUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_WEB_BASE_URL;
  return url ?? "https://agrofast.tech";
};

export const getWebUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_WEB_BASE_URL;
  return url ? new URL("/web", url).toString() : "https://agrofast.tech/web";
};

export const getLegalUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_WEB_BASE_URL;
  return url
    ? new URL("/legal", url).toString()
    : "https://agrofast.tech/legal";
};
