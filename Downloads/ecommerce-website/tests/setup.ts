import * as React from "react";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

/**
 * jsdom doesn't implement matchMedia, IntersectionObserver, or
 * ResizeObserver — all three are used across the app (useMediaQuery,
 * the shop's infinite-scroll grid, Radix primitives). Stubbing them once
 * here keeps every individual test file free of this boilerplate.
 */
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

class MockObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.IntersectionObserver = window.IntersectionObserver || MockObserver;
window.ResizeObserver = window.ResizeObserver || MockObserver;

// Next's <Image> optimizes via a server-side loader that isn't present in
// jsdom; render it as a plain <img> so component tests can assert on it.
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill: _fill, priority: _priority, sizes: _sizes, ...rest } = props;
    return React.createElement("img", rest);
  },
}));
