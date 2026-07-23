import { Container } from "@/components/ui/container";

/** Route-level fallback Next shows while navigating to a product page. */
export default function ProductDetailLoading() {
  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-pulse">
            <div className="aspect-[4/5] rounded-2xl bg-sand-100" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-sand-100" />
              ))}
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-3 w-24 rounded bg-sand-100" />
            <div className="mt-4 h-9 w-4/5 rounded bg-sand-100" />
            <div className="mt-4 h-7 w-24 rounded bg-sand-100" />
            <div className="mt-6 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 w-full rounded bg-sand-100" />
              ))}
            </div>
            <div className="mt-8 h-14 w-full rounded-full bg-sand-100" />
          </div>
        </div>
      </Container>
    </div>
  );
}
