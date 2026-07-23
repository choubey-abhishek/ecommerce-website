"use client";

import { useEffect } from "react";

/**
 * Locks body scroll while `active` is true — used by the mobile nav
 * drawer and cart drawer so the page behind an open overlay doesn't
 * scroll on iOS/Android. Restores the previous overflow value on
 * cleanup so nested usage (menu + cart both mounted) doesn't clobber
 * each other.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}
