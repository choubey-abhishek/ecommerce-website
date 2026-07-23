import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextProps } from "@portabletext/react";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";
import { getPostBySlug, getPosts, urlForImage } from "@/lib/sanity";

// Matches the listing page's revalidation window (see app/journal/page.tsx)
// so a post's content and its card on /journal go stale/fresh together.
export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return buildMetadata({ title: "Post Not Found", noIndex: true });

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/journal/${post.slug}`,
  });
}

export default async function JournalPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const imageUrl = post.coverImage
    ? urlForImage(post.coverImage).width(1600).height(900).url()
    : null;

  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container narrow>
        <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="mt-3 font-serif text-display-md font-light text-ink">
          {post.title}
        </h1>

        {imageUrl && (
          <div className="relative mt-10 aspect-video overflow-hidden rounded-2xl bg-sand-100">
            <Image src={imageUrl} alt={post.title} fill sizes="700px" className="object-cover" />
          </div>
        )}

        <div className="prose-journal mt-10 space-y-5 font-sans text-[16px] leading-relaxed text-ink/75 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink [&_img]:rounded-2xl">
          <PortableText value={post.body as PortableTextProps["value"]} />
        </div>
      </Container>
    </div>
  );
}
