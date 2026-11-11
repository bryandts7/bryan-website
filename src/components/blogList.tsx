import Link from "next/link";
import { formatDate, type PostSummary } from "@/lib/content";

interface BlogListProps {
  posts: PostSummary[];
}

function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600">{post.excerpt}</p>
          {post.published_at && (
            <p className="mt-3 text-sm text-gray-400">{formatDate(post.published_at)}</p>
          )}
        </Link>
      ))}
    </div>
  );
}

export default BlogList;
