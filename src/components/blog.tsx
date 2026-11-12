import Image from "next/image";
import MarkdownContent from "./MarkdownContent";
import { Tag } from "./ui";

interface BlogProps {
  title: string;
  content: string;
  date?: string | null;
  isoDate?: string | null;
  readingMinutes?: number;
  tags?: string[];
  coverImageUrl?: string | null;
}

/** Shared article typography: readable line length, dark-mode aware. */
export const articleProse =
  "prose prose-zinc max-w-none sm:prose-lg dark:prose-invert prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:border prose-pre:border-line prose-code:before:content-none prose-code:after:content-none";

function Blog({ title, content, date, isoDate, readingMinutes, tags = [], coverImageUrl }: BlogProps) {
  return (
    <article>
      <header className="pt-8 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl sm:leading-tight">{title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-subtle">
          {date && <time dateTime={isoDate ?? undefined}>{date}</time>}
          {date && readingMinutes && <span aria-hidden>·</span>}
          {readingMinutes && <span>{readingMinutes} min read</span>}
          {tags.length > 0 && (
            <span className="flex flex-wrap gap-1.5 sm:ml-2">
              {tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </span>
          )}
        </div>
      </header>
      {coverImageUrl && (
        <div className="relative mb-10 aspect-[2/1] w-full overflow-hidden rounded-xl bg-surface">
          <Image src={coverImageUrl} alt="" fill priority sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
        </div>
      )}
      <div className={articleProse}>
        <MarkdownContent>{content}</MarkdownContent>
      </div>
    </article>
  );
}

export default Blog;
