"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

/**
 * Catches errors thrown anywhere in the app's page tree (below the root
 * layout — see app/global-error.tsx for the layout-level fallback) and
 * shows a branded, on-message screen instead of Next's default error
 * overlay in production. Matches the tone/markup of app/not-found.tsx so
 * a broken page still feels like part of the same site.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Real error visibility, not a silent swallow — this is the one spot
    // in the app that intentionally logs unexpected exceptions. Once a
    // real error-tracking service (Sentry, etc.) is added, this is the
    // single place to also forward `error` there.
    console.error("[error-boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center pt-24">
      <Container narrow className="text-center">
        <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
          Something Went Wrong
        </p>
        <h1 className="mt-3 font-serif text-display-md font-light text-ink">
          A Small Crack Appeared
        </h1>
        <p className="mx-auto mt-4 max-w-sm font-sans text-[15px] leading-relaxed text-ink/60">
          Something unexpected happened loading this page. It&apos;s been logged
          — try again, or head back to the collection in the meantime.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="md" onClick={reset}>
            Try Again
          </Button>
          <Button asChild size="md" variant="outline">
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
