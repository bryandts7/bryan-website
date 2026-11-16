import Image from "next/image";
import type { ReactNode } from "react";
import { Bi, BiDate, T } from "./Lang";
import MarkdownContent from "./MarkdownContent";
import { Tag } from "./ui";

interface BlogProps {
  title: string;
  /** Indonesian title; null until translated. */
  titleId?: string | null;
  content: string;
  /** Indonesian Markdown; null until translated. */
  contentId?: string | null;
  isoDate?: string | null;
  readingMinutes?: number;
  tags?: string[];
  coverImageUrl?: string | null;
  /** Extra items for the date line, e.g. the view count. */
  meta?: ReactNode;
}

/** Shared article typography: readable line length, dark-mode aware. */
export const articleProse =
  "prose prose-zinc max-w-none sm:prose-lg dark:prose-invert prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:border prose-pre:border-line prose-code:before:content-none prose-code:after:content-none";

function Blog({ title, titleId, content, contentId, isoDate, readingMinutes, tags = [], coverImageUrl, meta }: BlogProps) {
  return (
    <article>
      <header className="pt-8 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl sm:leading-tight">
          <Bi en={title} id={titleId} />
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-subtle">
          {isoDate && <BiDate iso={isoDate} />}
          {isoDate && readingMinutes && <span aria-hidden>·</span>}
          {readingMinutes && (
            <span>
              {readingMinutes} <T k="blog.minRead" />
            </span>
          )}
          {meta}
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
      {contentId ? (
        // Both versions are in the page; CSS shows the reader's language.
        <Bi
          block
          en={
            <div className={articleProse}>
              <MarkdownContent>{content}</MarkdownContent>
            </div>
          }
          id={
            <div className={articleProse}>
              <MarkdownContent>{contentId}</MarkdownContent>
            </div>
          }
        />
      ) : (
        <>
          {/* Shown only to readers who chose Indonesian. */}
          <p className="lang-id mb-8 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted" lang="id">
            <T k="blog.notTranslated" />
          </p>
          <div className={articleProse}>
            <MarkdownContent>{content}</MarkdownContent>
          </div>
        </>
      )}
    </article>
  );
}

export default Blog;
