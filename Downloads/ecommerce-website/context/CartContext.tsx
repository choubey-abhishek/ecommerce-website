"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import type { Product } from "@/lib/products";
import { applyCoupon, type Coupon } from "@/lib/coupons";
import { getShippingEstimate } from "@/lib/shipping";

export type CartItem = {
  product: Product;
  quantity: number;
};

const STORAGE_KEY = "kopal-seth-studio:cart";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;

  subtotal: number;
  couponCode: string | null;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  discount: number;
  applyCouponCode: (code: string) => void;
  removeCoupon: () => void;

  shippingRegion: "domestic" | "international";
  setShippingRegion: (region: "domestic" | "international") => void;
  shippingEstimate: number;
  total: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [shippingRegion, setShippingRegion] = useState<"domestic" | "international">(
    "domestic"
  );

  // Persist the cart across reloads/tabs — a plain in-memory cart that
  // vanishes on refresh is a common source of lost sales.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // Corrupt or inaccessible storage — start from an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode(null);
    setCouponError(null);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.product.id !== productId)
        : prev.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
    );
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const couponResult = useMemo(
    () => (couponCode ? applyCoupon(couponCode, subtotal) : null),
    [couponCode, subtotal]
  );

  const applyCouponCode = useCallback(
    (code: string) => {
      const result = applyCoupon(code, subtotal);
      if (!result.valid) {
        setCouponError(result.message);
        setCouponCode(null);
        return;
      }
      setCouponCode(code.trim().toUpperCase());
      setCouponError(null);
    },
    [subtotal]
  );

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    setCouponError(null);
  }, []);

  const discount = couponResult?.valid ? couponResult.discount : 0;
  const shippingEstimate = useMemo(
    () => getShippingEstimate(subtotal - discount, shippingRegion),
    [subtotal, discount, shippingRegion]
  );
  const total = Math.max(subtotal - discount, 0) + shippingEstimate;

  const value: CartContextValue = {
    items,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,

    subtotal,
    couponCode,
    appliedCoupon: couponResult?.valid ? couponResult.coupon ?? null : null,
    couponError,
    discount,
    applyCouponCode,
    removeCoupon,

    shippingRegion,
    setShippingRegion,
    shippingEstimate,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
