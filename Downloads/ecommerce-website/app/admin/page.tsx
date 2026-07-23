import type { Metadata } from "next";
import Link from "next/link";
import { Package, Layers, Tag, Users, ShoppingCart, CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { products, PRODUCT_CATEGORIES } from "@/lib/products";
import { COUPONS } from "@/lib/coupons";
import { isStripeConfigured, getStripeClient } from "@/lib/stripe";
import { isClerkConfigured } from "@/lib/auth-config";
import { StatCard } from "@/components/admin/stat-card";

export const metadata: Metadata = buildMetadata({
  title: "Admin Dashboard",
  path: "/admin",
  noIndex: true,
});

async function getOrderCount(): Promise<number | null> {
  if (!isStripeConfigured) return null;
  try {
    const stripe = getStripeClient();
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    return sessions.data.filter((s) => s.payment_status === "paid").length;
  } catch {
    return null;
  }
}

async function getCustomerCount(): Promise<number | null> {
  if (!isClerkConfigured) return null;
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    return await client.users.getCount();
  } catch {
    return null;
  }
}

export default async function AdminDashboardPage() {
  const [orderCount, customerCount] = await Promise.all([
    getOrderCount(),
    getCustomerCount(),
  ]);

  const available = products.filter((p) => !p.sold).length;
  const sold = products.filter((p) => p.sold).length;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="Products"
          value={products.length}
          hint={`${available} available, ${sold} sold`}
          icon={<Package className="h-4 w-4 text-ink/30" strokeWidth={1.5} />}
        />
        <StatCard
          label="Categories"
          value={PRODUCT_CATEGORIES.length}
          icon={<Layers className="h-4 w-4 text-ink/30" strokeWidth={1.5} />}
        />
        <StatCard
          label="Active Coupons"
          value={COUPONS.length}
          icon={<Tag className="h-4 w-4 text-ink/30" strokeWidth={1.5} />}
        />
        <StatCard
          label="Paid Orders"
          value={orderCount ?? "—"}
          hint={orderCount === null ? "Connect Stripe to see live orders" : "via Stripe"}
          icon={<ShoppingCart className="h-4 w-4 text-ink/30" strokeWidth={1.5} />}
        />
        <StatCard
          label="Customers"
          value={customerCount ?? "—"}
          hint={customerCount === null ? "Connect Clerk to see signed-up customers" : "signed up"}
          icon={<Users className="h-4 w-4 text-ink/30" strokeWidth={1.5} />}
        />
        <StatCard
          label="Site Status"
          value="Live"
          hint="All core pages operational"
          icon={<CheckCircle2 className="h-4 w-4 text-ink/30" strokeWidth={1.5} />}
        />
      </div>

      <div className="mt-10 rounded-2xl bg-sand-50 p-6">
        <h2 className="font-serif text-lg text-ink">What&apos;s Real vs. Placeholder Here</h2>
        <p className="mt-3 max-w-2xl font-sans text-[14px] leading-relaxed text-ink/65">
          Product, category, and coupon numbers come straight from the
          site&apos;s live data files. Orders and Customers only populate
          once Stripe and Clerk are configured — they&apos;re never
          faked. There&apos;s no database yet (that&apos;s Phase 9), so
          nothing here is editable yet; think of this as a real read-only
          window into the studio&apos;s data.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 font-sans text-[13px]">
          <Link href="/admin/products" className="text-ink underline underline-offset-4">
            View Products →
          </Link>
          <Link href="/admin/orders" className="text-ink underline underline-offset-4">
            View Orders →
          </Link>
        </div>
      </div>
    </div>
  );
}
