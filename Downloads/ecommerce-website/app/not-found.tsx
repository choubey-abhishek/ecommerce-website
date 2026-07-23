import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center pt-24">
      <Container narrow className="text-center">
        <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
          404
        </p>
        <h1 className="mt-3 font-serif text-display-md font-light text-ink">
          This Piece Isn&apos;t Here
        </h1>
        <p className="mx-auto mt-4 max-w-sm font-sans text-[15px] leading-relaxed text-ink/60">
          The page you&apos;re looking for may have sold, moved, or never
          existed. Let&apos;s get you back to the collection.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="md">
            <Link href="/shop">Browse the Shop</Link>
          </Button>
          <Button asChild size="md" variant="outline">
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
