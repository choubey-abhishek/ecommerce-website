import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { isClerkConfigured, isAdminEmail } from "@/lib/auth-config";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/media", label: "Media" },
];

function InfoScreen({ title, body }: { title: string; body: ReactNode }) {
  return (
    <div className="flex min-h-[70vh] items-center pt-24">
      <Container narrow className="text-center">
        <p className="font-sans text-xs uppercase tracking-widest text-ink/50">Admin</p>
        <h1 className="mt-3 font-serif text-display-md font-light text-ink">{title}</h1>
        <div className="mx-auto mt-4 max-w-sm font-sans text-[15px] leading-relaxed text-ink/60">
          {body}
        </div>
        <Button asChild size="md" className="mt-8">
          <Link href="/">Back Home</Link>
        </Button>
      </Container>
    </div>
  );
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!isClerkConfigured) {
    return (
      <InfoScreen
        title="Admin Isn't Configured Yet"
        body={
          <>
            The dashboard needs Clerk authentication to identify who&apos;s
            allowed in — see{" "}
            <code className="rounded bg-sand-100 px-1.5 py-0.5 text-[13px]">
              .env.local.example
            </code>{" "}
            for setup.
          </>
        }
      />
    );
  }

  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!isAdminEmail(email)) {
    return (
      <InfoScreen
        title="Access Restricted"
        body={
          <>
            {email ?? "This account"} isn&apos;t on the admin list. Add it
            to{" "}
            <code className="rounded bg-sand-100 px-1.5 py-0.5 text-[13px]">
              ADMIN_EMAILS
            </code>{" "}
            in <code className="text-[13px]">.env.local</code> to grant
            access.
          </>
        }
      />
    );
  }

  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container>
        <div className="mb-14 sm:mb-16">
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
            Studio Admin
          </p>
          <h1 className="mt-3 font-serif text-display-md font-light text-ink">
            Dashboard
          </h1>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <aside className="flex-shrink-0 lg:w-56">
            <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
              {ADMIN_NAV.map((item) => (
                <li key={item.href} className="flex-shrink-0">
                  <Link
                    href={item.href}
                    className="block whitespace-nowrap rounded-full px-4 py-2 font-sans text-[13px] uppercase tracking-widest text-ink/60 transition-colors hover:bg-sand-100 hover:text-ink lg:rounded-lg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </Container>
    </div>
  );
}
