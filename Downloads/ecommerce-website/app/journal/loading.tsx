import { Container } from "@/components/ui/container";

/**
 * Shown while the Journal listing's server component fetches from Sanity
 * (see app/journal/page.tsx). Mirrors the real grid's dimensions so there's
 * no layout shift once posts arrive.
 */
export default function JournalLoading() {
  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container>
        <div className="mb-14 max-w-xl animate-pulse sm:mb-20">
          <div className="h-3 w-16 rounded bg-sand-100" />
          <div className="mt-4 h-9 w-64 rounded bg-sand-100" />
          <div className="mt-4 h-4 w-full rounded bg-sand-100" />
        </div>

        <div
          className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
          aria-hidden="true"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] rounded-2xl bg-sand-100" />
              <div className="mt-4 h-3 w-1/3 rounded bg-sand-100" />
              <div className="mt-2 h-5 w-2/3 rounded bg-sand-100" />
              <div className="mt-2 h-4 w-full rounded bg-sand-100" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
