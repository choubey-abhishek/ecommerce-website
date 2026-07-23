"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";

/** Fires `clearCart()` exactly once after a confirmed, paid Stripe session. */
export function ClearCartOnMount() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (hasCleared.current) return;
    hasCleared.current = true;
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
