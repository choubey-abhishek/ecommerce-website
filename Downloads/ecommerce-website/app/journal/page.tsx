import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";
import { getPosts, isSanityConfigured } from "@/lib/sanity";
import { JournalPostCard } from "@/components/JournalPostCard";

export const metadata: Metadata = buildMetadata({
  title: "Journal",
  description:
    "Notes from the studio — process, exhibitions, and new work from ceramic artist Kopal Seth.",
  path: "/journal",
});

// Sanity content doesn't need to be real-time — a 5-minute cache means a
// freshly published post shows up quickly without hitting the CMS on
// every single request. `getPosts()` also has its own try/catch, so a
// slow or failing Sanity call during revalidation never takes the page
// down; it just serves the last good cached version.
export const revalidate = 300;

export default async function JournalPage() {
  const posts = await getPosts();

  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container>
        <div className="mb-14 max-w-xl sm:mb-20">
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
            Journal
          </p>
          <h1 className="mt-3 font-serif text-display-md font-light text-ink">
            Notes from the Studio
          </h1>
          <p className="mt-4 font-sans text-[15px] leading-relaxed text-ink/60">
            Process notes, exhibition updates, and new work — written
            straight from the studio.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink/15 py-24 text-center">
            <BookOpen className="h-8 w-8 text-ink/30" strokeWidth={1.25} />
            <div>
              <h2 className="font-serif text-xl text-ink">
                {isSanityConfigured ? "No Posts Yet" : "The Journal Is Coming Soon"}
              </h2>
              <p className="mx-auto mt-2 max-w-sm font-sans text-[14px] leading-relaxed text-ink/55">
                {isSanityConfigured
                  ? "Nothing has been published yet — check back soon."
                  : "This page is wired up to Sanity CMS, but no project has been connected yet. In the meantime, follow along on Instagram for studio updates."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <JournalPostCard key={post._id} post={post} index={index} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
