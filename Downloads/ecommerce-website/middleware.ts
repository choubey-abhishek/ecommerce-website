import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/auth-config";

const isProtectedRoute = createRouteMatcher(["/account(.*)", "/admin(.*)"]);

/**
 * Route protection only activates once real Clerk keys exist (see
 * `lib/auth-config.ts`). `clerkMiddleware()` is only ever *called* in
 * the configured branch — merely importing it is safe, but invoking it
 * without keys throws on every request, which would take down the
 * entire site rather than just /account for anyone who hasn't set up
 * Clerk yet.
 */
export default isClerkConfigured
  ? clerkMiddleware((auth, req) => {
      if (isProtectedRoute(req)) auth().protect();
    })
  : function middleware() {
      return NextResponse.next();
    };

export const config = {
  // Excludes Next internals, static files, and /api/webhooks — Stripe's
  // webhook calls are unauthenticated, server-to-server requests that
  // have no business going through Clerk at all.
  matcher: ["/((?!_next|api/webhooks|.*\\..*).*)"],
};
