import type { Metadata } from "next";
import BlogList from "@/components/blogList";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog posts about casual mathematics, statistics and machine learning.",
};

export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <div className="grow bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <BlogList posts={posts} />
      </div>
    </div>
  );
}
