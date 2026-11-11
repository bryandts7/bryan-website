import { getCurrentUser } from "@/lib/auth";
import { getComments } from "@/lib/comments";
import CommentThread from "./CommentThread";

/**
 * Reads the visitor's session, so it must sit inside <Suspense>: the rest of
 * the post stays static and this part streams in.
 */
export default async function CommentsSection({ postId, slug }: { postId: string; slug: string }) {
  const [comments, user] = await Promise.all([getComments(postId), getCurrentUser()]);

  return (
    <CommentThread
      postId={postId}
      slug={slug}
      comments={comments}
      viewer={
        user
          ? {
              id: user.id,
              displayName: user.displayName,
              avatarUrl: user.avatarUrl,
              isAdmin: user.role === "admin",
            }
          : null
      }
    />
  );
}

export function CommentsSkeleton() {
  return (
    <div className="space-y-4" aria-busy>
      <div className="h-7 w-40 rounded bg-gray-100" />
      <div className="h-24 rounded-lg bg-gray-50" />
    </div>
  );
}
