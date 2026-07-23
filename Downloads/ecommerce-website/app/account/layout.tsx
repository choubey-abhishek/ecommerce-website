import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { isClerkConfigured } from "@/lib/auth-config";
import { AccountNav } from "@/components/account/account-nav";

export default function AccountLayout({ children }: { children: ReactNode }) {
  if (!isClerkConfigured) {
    return (
      <div className="flex min-h-[70vh] items-center pt-24">
        <Container narrow className="text-center">
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
            Accounts
          </p>
          <h1 className="mt-3 font-serif text-display-md font-light text-ink">
            Accounts Aren&apos;t Configured Yet
          </h1>
          <p className="mx-auto mt-4 max-w-sm font-sans text-[15px] leading-relaxed text-ink/60">
            This site is wired up for Clerk authentication, but no API keys
            have been added yet — see{" "}
            <code className="rounded bg-sand-100 px-1.5 py-0.5 text-[13px]">
              .env.local.example
            </code>{" "}
            for setup instructions.
          </p>
          <Button asChild size="md" className="mt-8">
            <Link href="/">Back Home</Link>
          </Button>
        </Container>
      </div>
    );
  }

  // Middleware already protects /account(.*), but a direct server-side
  // check here is cheap defense-in-depth against a misconfigured matcher.
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container>
        <div className="mb-14 sm:mb-16">
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
            Your Account
          </p>
          <h1 className="mt-3 font-serif text-display-md font-light text-ink">
            Welcome Back
          </h1>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <aside className="flex-shrink-0 lg:w-56">
            <AccountNav />
          </aside>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </Container>
    </div>
  );
}
