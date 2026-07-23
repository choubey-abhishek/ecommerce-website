import type { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { isClerkConfigured } from "@/lib/auth-config";

export const metadata: Metadata = buildMetadata({
  title: "Sign In",
  path: "/sign-in",
  noIndex: true,
});

export default function SignInPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center pt-24">
      <Container narrow className="flex justify-center">
        {isClerkConfigured ? (
          <SignIn />
        ) : (
          <div className="max-w-sm text-center">
            <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
              Accounts
            </p>
            <h1 className="mt-3 font-serif text-2xl font-light text-ink">
              Sign-In Isn&apos;t Configured Yet
            </h1>
            <p className="mt-4 font-sans text-[14px] leading-relaxed text-ink/60">
              This site is wired up for Clerk authentication, but no API
              keys have been added yet. Add
              <code className="mx-1 rounded bg-sand-100 px-1.5 py-0.5 text-[13px]">
                NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
              </code>
              and
              <code className="mx-1 rounded bg-sand-100 px-1.5 py-0.5 text-[13px]">
                CLERK_SECRET_KEY
              </code>
              to <code className="text-[13px]">.env.local</code> to enable it — see
              <code className="mx-1 rounded bg-sand-100 px-1.5 py-0.5 text-[13px]">
                .env.local.example
              </code>
              .
            </p>
            <Button asChild size="md" className="mt-8">
              <Link href="/">Back Home</Link>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
