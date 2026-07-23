import type { Metadata } from "next";
import { ExternalLink, Newspaper } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { isSanityConfigured, getPosts } from "@/lib/sanity";
import { DataTable, type Column } from "@/components/admin/data-table";

export const metadata: Metadata = buildMetadata({
  title: "Admin — Blog",
  path: "/admin/blog",
  noIndex: true,
});

interface PostRow {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
}

const columns: Column<PostRow>[] = [
  { header: "Title", render: (p) => p.title },
  { header: "Slug", render: (p) => <span className="text-ink/50">/journal/{p.slug}</span> },
  {
    header: "Published",
    render: (p) =>
      new Date(p.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
];

export default async function AdminBlogPage() {
  const posts = isSanityConfigured ? await getPosts() : [];
  const rows: PostRow[] = posts.map((post) => ({
    id: post._id,
    title: post.title,
    slug: post.slug,
    publishedAt: post.publishedAt,
  }));

  if (!isSanityConfigured) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 py-20 text-center">
        <Newspaper className="h-7 w-7 text-ink/30" strokeWidth={1.25} />
        <div>
          <h2 className="font-serif text-lg text-ink">Blog / Journal Management</h2>
          <p className="mx-auto mt-2 max-w-sm font-sans text-[14px] leading-relaxed text-ink/55">
            Connect Sanity CMS (see <code className="text-[13px]">.env.local.example</code>) to
            author and manage Journal posts. Nothing is faked in the meantime.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg text-ink">Journal Posts</h2>
        <a
          href="https://www.sanity.io/manage"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-sans text-[12px] uppercase tracking-wide text-ink/60 hover:text-ink"
        >
          Manage in Sanity Studio
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(p) => p.id}
        emptyMessage="No posts published yet — author your first one in Sanity Studio."
      />
    </div>
  );
}
