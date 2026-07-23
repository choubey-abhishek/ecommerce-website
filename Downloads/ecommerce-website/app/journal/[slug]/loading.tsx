import { Container } from "@/components/ui/container";

/** Shown while a single Journal post's server component fetches from Sanity. */
export default function JournalPostLoading() {
  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container narrow>
        <div className="animate-pulse">
          <div className="h-3 w-32 rounded bg-sand-100" />
          <div className="mt-4 h-10 w-4/5 rounded bg-sand-100" />
          <div className="mt-10 aspect-video rounded-2xl bg-sand-100" />
          <div className="mt-10 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-sand-100" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
