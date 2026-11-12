import Link from "next/link";
import type { PostSummary } from "@/lib/content";
import { formatDate } from "@/lib/dates";
import { Tag } from "./ui";

/** One post in a list: the whole card links to the post. */
export default function PostCard({ post, headingLevel = "h2" }: { post: PostSummary; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative rounded-xl border border-line bg-card p-5 transition-colors hover:border-subtle sm:p-6">
      <div className="flex flex-wrap items-center gap-x-2 text-sm text-subtle">
        {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
        <span aria-hidden>·</span>
        <span>{post.reading_minutes} min read</span>
      </div>
      <Heading className="mt-2 text-lg font-semibold leading-snug text-ink group-hover:text-accent sm:text-xl">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
          {post.title}
        </Link>
      </Heading>
      {post.excerpt && <p className="mt-2 line-clamp-3 text-muted">{post.excerpt}</p>}
      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
    </article>
  );
}
