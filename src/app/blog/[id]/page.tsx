import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BackLink from "@/components/BackLink";
import Blog from "@/components/blog";
import CommentsSection, { CommentsSkeleton } from "@/components/comments/CommentsSection";
import { Container } from "@/components/ui";
import { formatDate, getPost, getPosts } from "@/lib/content";
import { OPEN_GRAPH_DEFAULTS } from "@/lib/site";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(({ slug }) => ({ id: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    // The preview image comes from ./opengraph-image.tsx.
    // Page-level openGraph replaces the layout's, so the shared fields are repeated.
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <Container size="narrow" className="pt-8">
      <BackLink href="/blogs">All posts</BackLink>
      <Blog
        title={post.title}
        content={post.content_md}
        date={formatDate(post.published_at)}
        isoDate={post.published_at}
        readingMinutes={post.reading_minutes}
        tags={post.tags}
        coverImageUrl={post.cover_image_url}
      />
      <section id="comments" className="mt-16 scroll-mt-24 border-t border-line pt-10">
        {/* Comments depend on who is visiting, so they stream in after the static post. */}
        <Suspense fallback={<CommentsSkeleton />}>
          <CommentsSection postId={post.id} slug={post.slug} />
        </Suspense>
      </section>
    </Container>
  );
}
