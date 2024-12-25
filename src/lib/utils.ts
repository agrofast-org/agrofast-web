import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numberInputMask(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4}).*/, "+$1 ($2) $3-$4");
}

export const isDev = (): boolean => {
  return process.env.NODE_ENV === "development";
};

export const getPortfolioUrl = (): string => {
  if (isDev()) {
    return "http://local.agrofast.tech";
  }
  return "https://agrofast.tech";
};
