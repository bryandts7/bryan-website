import { getComments } from "@/lib/comments";
import CommentThread from "./CommentThread";

/**
 * Comments come from a cache shared by every visitor, so the post page can be
 * built ahead in full. Who is signed in is read in the browser (useViewer).
 */
export default async function CommentsSection({ postId, slug }: { postId: string; slug: string }) {
  const comments = await getComments(postId);
  return <CommentThread postId={postId} slug={slug} comments={comments} />;
}

export function CommentsSkeleton() {
  return (
    <div className="space-y-4" aria-busy>
      <div className="h-7 w-40 rounded bg-surface" />
      <div className="h-24 rounded-lg bg-surface" />
    </div>
  );
}
