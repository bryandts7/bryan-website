import Link from "next/link";
import type { PostSummary } from "@/lib/content";
import { Bi, BiDate, T } from "./Lang";
import { Tag } from "./ui";

/** One post in a list: the whole card links to the post. */
export default function PostCard({ post, headingLevel = "h2" }: { post: PostSummary; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative rounded-xl border border-line bg-card p-5 transition-colors hover:border-subtle sm:p-6">
      <div className="flex flex-wrap items-center gap-x-2 text-sm text-subtle">
        <BiDate iso={post.published_at} />
        <span aria-hidden>·</span>
        <span>
          {post.reading_minutes} <T k="blog.minRead" />
        </span>
      </div>
      <Heading className="mt-2 text-lg font-semibold leading-snug text-ink group-hover:text-accent sm:text-xl">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
          <Bi en={post.title} id={post.title_id} />
        </Link>
      </Heading>
      {post.excerpt && (
        <p className="mt-2 line-clamp-3 text-muted">
          <Bi en={post.excerpt} id={post.excerpt_id} />
        </p>
      )}
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
