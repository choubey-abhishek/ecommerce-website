import { NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/auth-config";
import { isStripeConfigured } from "@/lib/stripe";
import { isDatabaseConfigured } from "@/lib/db";
import { isSanityConfigured } from "@/lib/sanity";

/**
 * A real health-check endpoint for uptime monitoring (Vercel, UptimeRobot,
 * a status page, etc.) — not just a 200 OK, but an honest snapshot of
 * which optional integrations are live in this environment. Never
 * returns secret values, just booleans, so it's safe to leave public.
 * Excluded from the sitemap and disallowed in robots.ts alongside the
 * rest of /api.
 */
export function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    integrations: {
      clerk: isClerkConfigured,
      stripe: isStripeConfigured,
      database: isDatabaseConfigured,
      sanity: isSanityConfigured,
    },
  });
}
