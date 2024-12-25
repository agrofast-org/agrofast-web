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
