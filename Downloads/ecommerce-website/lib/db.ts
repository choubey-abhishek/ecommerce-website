import { PrismaClient } from "@prisma/client";

/**
 * Whether a real database is configured. Checked before every DB call
 * so the site works identically without one — order confirmation
 * emails/pages already come from Stripe directly, so a missing
 * database only means orders aren't *also* persisted locally, not that
 * anything breaks. Mirrors `isClerkConfigured` / `isStripeConfigured`.
 */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Standard Next.js dev-mode singleton: without this, hot-reloading
 * `next dev` creates a new PrismaClient (and a new DB connection pool)
 * on every file save, quickly exhausting Postgres's connection limit.
 */
function createPrismaClient(): PrismaClient | null {
  if (!isDatabaseConfigured) return null;
  return global.__prisma ?? new PrismaClient();
}

export const prisma = createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  global.__prisma = prisma;
}

/** Throws if called without a configured database — callers should check `isDatabaseConfigured` first. */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    throw new Error(
      "Database isn't configured — check isDatabaseConfigured before calling getPrismaClient()."
    );
  }
  return prisma;
}
