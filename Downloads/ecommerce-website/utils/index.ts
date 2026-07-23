import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class lists safely (later classes win on conflicting
 * utilities). Standard shadcn/ui convention — used by every component
 * that accepts a `className` override prop.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Consistent currency formatting for prices across shop, cart, and
 * checkout. Centralizing this now avoids three slightly different
 * `Intl.NumberFormat` calls once the Cart and Checkout phases land.
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
}

/** Trims to `length` characters on a word boundary, appending an ellipsis. */
export function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  const trimmed = text.slice(0, length).trimEnd();
  return `${trimmed.slice(0, trimmed.lastIndexOf(" "))}…`;
}

/** Builds a URL-safe slug from a title, e.g. for product/journal routes. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
