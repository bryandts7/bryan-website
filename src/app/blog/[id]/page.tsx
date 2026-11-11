import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Blog from "@/components/blog";
import { formatDate, getPost, getPosts } from "@/lib/content";

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
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="container mx-auto p-4 grow">
      <BackLink href="/blogs">Back to Blog</BackLink>
      <Blog
        title={post.title}
        content={post.content_md}
        date={formatDate(post.published_at)}
      />
    </div>
  );
}
