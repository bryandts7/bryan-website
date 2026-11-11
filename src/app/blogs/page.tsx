import type { Metadata } from "next";
import BlogList from "@/components/blogList";
import { blogPosts } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog posts about casual mathematics, statistics and machine learning.",
};

export default function BlogListPage() {
  return (
    <div className="grow bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <BlogList posts={blogPosts} />
      </div>
    </div>
  );
}
