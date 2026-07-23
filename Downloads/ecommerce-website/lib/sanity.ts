import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { TypedObject } from "@portabletext/types";

export const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

let _client: SanityClient | null = null;

function getSanityClient(): SanityClient {
    if (!isSanityConfigured) {
          throw new Error("Sanity isn't configured — check isSanityConfigured first.");
    }
    if (!_client) {
          _client = createClient({
                  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
                  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
                  apiVersion: "2024-01-01",
                  useCdn: true,
          });
    }
    return _client;
}

export function urlForImage(source: unknown) {
    return imageUrlBuilder(getSanityClient()).image(source as never);
}

export interface BlogPostSummary {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: unknown;
    publishedAt: string;
}

/** Full journal post document, including the Portable Text body. */
export interface JournalPost extends BlogPostSummary {
    /** Sanity's Portable Text array — rendered via `<PortableText value={body} />`. */
  body: TypedObject[];
}

/**
 * Expected Sanity document shape — create this schema in your Sanity
 * Studio (`sanity.io/manage` → your project → Studio, or run
 * `npm create sanity@latest` in a separate `/studio` folder):
 *
 *   defineType({
 *     name: 'post',
 *     type: 'document',
 *     fields: [
 *       defineField({ name: 'title', type: 'string' }),
 *       defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
 *       defineField({ name: 'excerpt', type: 'text' }),
 *       defineField({ name: 'coverImage', type: 'image' }),
 *       defineField({ name: 'publishedAt', type: 'datetime' }),
 *       defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
 *     ],
 *   })
 */
const SUMMARY_FIELDS = `"_id": _id, title, "slug": slug.current, excerpt, coverImage, publishedAt`;

export async function getPosts(): Promise<BlogPostSummary[]> {
    if (!isSanityConfigured) return [];
    try {
          const client = getSanityClient();
          return await client.fetch<BlogPostSummary[]>(
                  `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) { ${SUMMARY_FIELDS} }`
                );
    } catch (error) {
          console.error("[sanity] failed to fetch posts:", error);
          return [];
    }
}

export async function getPostBySlug(slug: string): Promise<JournalPost | null> {
    if (!isSanityConfigured) return null;
    try {
          const client = getSanityClient();
          return await client.fetch<JournalPost | null>(
                  `*[_type == "post" && slug.current == $slug][0] { ${SUMMARY_FIELDS}, body }`,
            { slug }
                );
    } catch (error) {
          console.error("[sanity] failed to fetch post:", error);
          return null;
    }
}
