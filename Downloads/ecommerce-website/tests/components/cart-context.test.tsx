import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";
import { getProductBySlug } from "@/lib/products";

const vessel = getProductBySlug("amber-horizon-vessel")!; // $480
const vase = getProductBySlug("sage-bloom-vase")!; // $260

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("CartContext", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("adds an item and opens the cart drawer", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(vessel));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.itemCount).toBe(1);
    expect(result.current.subtotal).toBe(vessel.price);
    expect(result.current.isOpen).toBe(true);
  });

  it("increments quantity when the same product is added twice", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(vessel));
    act(() => result.current.addItem(vessel));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.subtotal).toBe(vessel.price * 2);
  });

  it("updates quantity directly, removing the item at zero", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(vessel));
    act(() => result.current.updateQuantity(vessel.id, 3));
    expect(result.current.items[0].quantity).toBe(3);

    act(() => result.current.updateQuantity(vessel.id, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("removes an item by id", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(vessel));
    act(() => result.current.addItem(vase));
    act(() => result.current.removeItem(vessel.id));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe(vase.id);
  });

  it("applies a valid coupon and reflects the discount in the total", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(vessel)); // subtotal 480
    act(() => result.current.applyCouponCode("WELCOME10"));

    expect(result.current.appliedCoupon?.code).toBe("WELCOME10");
    expect(result.current.discount).toBe(48); // 10% of 480
    expect(result.current.couponError).toBeNull();
  });

  it("surfaces an error and does not apply an invalid coupon", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(vessel));
    act(() => result.current.applyCouponCode("FAKECODE"));

    expect(result.current.appliedCoupon).toBeNull();
    expect(result.current.discount).toBe(0);
    expect(result.current.couponError).toBeTruthy();
  });

  it("adds a shipping estimate below the free-shipping threshold and includes it in the total", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(vase)); // subtotal 260, below $300 threshold
    expect(result.current.shippingEstimate).toBeGreaterThan(0);
    expect(result.current.total).toBe(result.current.subtotal + result.current.shippingEstimate);
  });

  it("waives shipping at or above the free-shipping threshold", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(vessel)); // 480, above $300 threshold
    expect(result.current.shippingEstimate).toBe(0);
    expect(result.current.total).toBe(result.current.subtotal);
  });

  it("clearCart empties items and resets any applied coupon", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(vessel));
    act(() => result.current.applyCouponCode("WELCOME10"));
    act(() => result.current.clearCart());

    expect(result.current.items).toHaveLength(0);
    expect(result.current.appliedCoupon).toBeNull();
    expect(result.current.total).toBe(0);
  });

  it("persists the cart to localStorage and rehydrates a new provider instance", async () => {
    const { result, unmount } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(vessel));
    await waitFor(() =>
      expect(window.localStorage.getItem("kopal-seth-studio:cart")).toContain(vessel.id)
    );
    unmount();

    const { result: second } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(second.current.items).toHaveLength(1));
    expect(second.current.items[0].product.id).toBe(vessel.id);
  });
});
