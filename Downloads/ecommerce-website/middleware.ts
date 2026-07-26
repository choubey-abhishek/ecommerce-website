import { NextResponse } from "next/server";

/**
 * Middleware is intentionally edge-safe and does not import Clerk server-side
 * helpers. Route protection and authentication checks are handled in the
 * account/admin layouts and page components instead, which keeps this module
 * compatible with Vercel's Edge Runtime.
 */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  // Excludes Next internals, static files, and /api/webhooks — Stripe's
  // webhook calls are unauthenticated, server-to-server requests that
  // have no business going through Clerk at all.
  matcher: ["/((?!_next|api/webhooks|.*\\..*).*)"],
};
