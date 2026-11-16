import type { Metadata } from "next";
import Link from "next/link";
import { RssIcon } from "@/components/icons";
import { T } from "@/components/Lang";
import PostCard from "@/components/PostCard";
import { Container, PageHeader } from "@/components/ui";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing about mathematics, statistics and machine learning, explained casually.",
  alternates: { canonical: "/blogs" },
};

export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <Container size="narrow">
      <PageHeader
        title={<T k="blog.title" />}
        intro={
          <>
            <T k="blog.intro" />{" "}
            <Link href="/feed.xml" className="inline-flex items-center gap-1 text-base text-accent hover:underline">
              <RssIcon className="h-4 w-4" /> RSS
            </Link>
          </>
        }
      />
      {posts.length === 0 ? (
        <p className="text-muted">
          <T k="blog.noPosts" />
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Container>
  );
}
