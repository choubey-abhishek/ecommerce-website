/**
 * A flat-rate shipping estimate — not a real carrier quote. Real rates
 * (by weight, destination, and dimensional weight for fragile ceramics)
 * need a shipping API (Shippo/EasyPost) wired up at Checkout time; this
 * is deliberately just enough to show a realistic total in the cart
 * before that exists.
 */
export const SHIPPING = {
  freeThreshold: 300,
  domesticRate: 18,
  internationalRate: 45,
};

export function getShippingEstimate(
  subtotal: number,
  region: "domestic" | "international" = "domestic"
): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= SHIPPING.freeThreshold) return 0;
  return region === "domestic" ? SHIPPING.domesticRate : SHIPPING.internationalRate;
}
