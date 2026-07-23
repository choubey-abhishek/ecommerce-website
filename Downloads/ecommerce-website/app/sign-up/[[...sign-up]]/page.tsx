import type { Metadata } from "next";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { isClerkConfigured } from "@/lib/auth-config";

export const metadata: Metadata = buildMetadata({
  title: "Create an Account",
  path: "/sign-up",
  noIndex: true,
});

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center pt-24">
      <Container narrow className="flex justify-center">
        {isClerkConfigured ? (
          <SignUp />
        ) : (
          <div className="max-w-sm text-center">
            <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
              Accounts
            </p>
            <h1 className="mt-3 font-serif text-2xl font-light text-ink">
              Sign-Up Isn&apos;t Configured Yet
            </h1>
            <p className="mt-4 font-sans text-[14px] leading-relaxed text-ink/60">
              This site is wired up for Clerk authentication, but no API
              keys have been added yet — see
              <code className="mx-1 rounded bg-sand-100 px-1.5 py-0.5 text-[13px]">
                .env.local.example
              </code>
              for setup instructions.
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
