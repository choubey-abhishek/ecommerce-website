import { Container } from "@/components/ui/container";
import { ShopResultsSkeleton } from "@/components/ShopResultsSkeleton";

/** Route-level fallback Next shows while navigating to /shop. */
export default function ShopLoading() {
  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container>
        <div className="mb-14 max-w-xl animate-pulse sm:mb-20">
          <div className="h-3 w-24 rounded bg-sand-100" />
          <div className="mt-4 h-9 w-56 rounded bg-sand-100" />
          <div className="mt-4 h-4 w-full rounded bg-sand-100" />
        </div>
        <ShopResultsSkeleton />
      </Container>
    </div>
  );
}
