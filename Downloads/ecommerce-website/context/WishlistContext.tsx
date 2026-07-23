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

const STORAGE_KEY = "kopal-seth-studio:wishlist";

type WishlistContextValue = {
  productIds: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  count: number;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

/**
 * Client-only, localStorage-backed wishlist. There's no account system
 * yet (that's Phase 5 — Clerk auth), so this is intentionally scoped to
 * "remember what this browser liked" rather than a synced, per-user
 * list. Once auth + a database exist, this is the layer to swap for a
 * server-backed wishlist without touching any component that calls
 * `useWishlist()`.
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setProductIds(JSON.parse(stored));
    } catch {
      // Corrupt or inaccessible storage — start from an empty wishlist.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
  }, [productIds, hydrated]);

  const toggleWishlist = useCallback((productId: string) => {
    setProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  const value = useMemo(
    () => ({ productIds, isWishlisted, toggleWishlist, count: productIds.length }),
    [productIds, isWishlisted, toggleWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
