import Link from "next/link";
import Notice, { StatusBadge } from "@/components/admin/Notice";
import { adminListPosts } from "@/lib/admin-data";
import { getAdminState } from "@/lib/auth";
import { formatDate } from "@/lib/content";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  if ((await getAdminState()).status !== "admin") return null;
  const [posts, { deleted }] = await Promise.all([adminListPosts(), searchParams]);

  return (
    <div>
      {deleted && <Notice>Post deleted.</Notice>}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">Posts ({posts.length})</h2>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          New post
        </Link>
      </div>

      <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {posts.map((post) => (
          <li key={post.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
            <Link href={`/admin/posts/${post.id}`} className="min-w-0 grow font-medium text-blue-700 hover:underline">
              {post.title}
            </Link>
            <StatusBadge status={post.status} />
            <span className="w-36 text-right text-sm text-gray-500">
              {formatDate(post.published_at) ?? "Not published"}
            </span>
          </li>
        ))}
        {posts.length === 0 && <li className="px-4 py-6 text-sm text-gray-500">No posts yet.</li>}
      </ul>
    </div>
  );
}
