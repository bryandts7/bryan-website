import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Blog from "@/components/blog";
import { blogPosts } from "@/data/blogs";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return blogPosts.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <div className="container mx-auto p-4 grow">
      <BackLink href="/blogs">Back to Blog</BackLink>
      <Blog title={post.title} content={post.content} />
    </div>
  );
}
