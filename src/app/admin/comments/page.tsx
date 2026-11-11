import Link from "next/link";
import CommentModeration from "@/components/admin/CommentModeration";
import CommentBody from "@/components/comments/CommentBody";
import { adminListComments } from "@/lib/admin-data";
import { getAdminState } from "@/lib/auth";
import { formatDateTime } from "@/lib/dates";

const filters = [
  { id: "all", label: "All" },
  { id: "visible", label: "Visible" },
  { id: "hidden", label: "Hidden" },
] as const;

type Filter = (typeof filters)[number]["id"];

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  if ((await getAdminState()).status !== "admin") return null;
  const { show } = await searchParams;
  const filter: Filter = show === "visible" || show === "hidden" ? show : "all";
  const comments = await adminListComments(filter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-900">Comments ({comments.length})</h2>
        <div className="inline-flex overflow-hidden rounded-md border border-gray-300 text-sm">
          {filters.map(({ id, label }) => (
            <Link
              key={id}
              href={id === "all" ? "/admin/comments" : `/admin/comments?show=${id}`}
              aria-current={filter === id ? "page" : undefined}
              className={`px-3 py-1.5 ${filter === id ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      <p className="mb-3 text-sm text-gray-500">
        Newest first. Hidden comments are only visible here; deleting a comment also deletes its replies.
      </p>

      <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {comments.map((comment) => (
          <li key={comment.id} className={`space-y-2 px-4 py-4 ${comment.status === "hidden" ? "bg-amber-50/60" : ""}`}>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
              <span className="font-semibold text-gray-900">
                {comment.profiles?.display_name ?? "Deleted user"}
              </span>
              <span className="text-gray-500">{comment.parent_id ? "replied on" : "commented on"}</span>
              {comment.posts ? (
                <Link
                  href={`/blog/${comment.posts.slug}#comments`}
                  className="text-blue-700 hover:underline"
                >
                  {comment.posts.title}
                </Link>
              ) : (
                <span className="text-gray-500">a deleted post</span>
              )}
              <span className="text-gray-400">· {formatDateTime(comment.created_at)}</span>
              {comment.status === "hidden" && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  Hidden
                </span>
              )}
            </div>
            <div className="text-sm">
              <CommentBody text={comment.body} />
            </div>
            <CommentModeration id={comment.id} postId={comment.post_id} status={comment.status} />
          </li>
        ))}
        {comments.length === 0 && (
          <li className="px-4 py-6 text-sm text-gray-500">
            {filter === "hidden" ? "No hidden comments." : "No comments yet."}
          </li>
        )}
      </ul>
    </div>
  );
}
