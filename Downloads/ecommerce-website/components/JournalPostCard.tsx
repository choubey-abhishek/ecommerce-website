import Link from "next/link";
import Image from "next/image";
import type { BlogPostSummary } from "@/lib/sanity";
import { urlForImage } from "@/lib/sanity";

export function JournalPostCard({ post, index }: { post: BlogPostSummary; index: number }) {
  const imageUrl = post.coverImage
    ? urlForImage(post.coverImage).width(800).height(1000).url()
    : null;

  return (
    <Link href={`/journal/${post.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand-100">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-studio group-hover:scale-[1.02]"
            priority={index < 2}
          />
        )}
      </div>
      <p className="mt-4 font-sans text-[12px] uppercase tracking-widest text-ink/40">
        {new Date(post.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <h3 className="mt-2 font-serif text-xl text-ink">{post.title}</h3>
      <p className="mt-2 font-sans text-[14px] leading-relaxed text-ink/60">{post.excerpt}</p>
    </Link>
  );
}
