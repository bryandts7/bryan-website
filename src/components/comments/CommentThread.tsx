"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteComment, setCommentHidden } from "@/app/comments/actions";
import type { PublicComment } from "@/lib/comments";
import { formatDateTime } from "@/lib/dates";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import Avatar from "./Avatar";
import CommentBody from "./CommentBody";
import CommentForm from "./CommentForm";
import { useViewer, type Viewer } from "./useViewer";

export default function CommentThread({
  postId,
  slug,
  comments,
}: {
  postId: string;
  slug: string;
  comments: PublicComment[];
}) {
  const loadedViewer = useViewer();
  const viewer = loadedViewer ?? null;
  const router = useRouter();
  const [signingOut, startSignOut] = useTransition();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const topLevel = comments.filter((comment) => !comment.parentId);
  const repliesTo = (id: string) => comments.filter((comment) => comment.parentId === id);
  const here = `/blog/${slug}#comments`;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-ink">
        Comments{comments.length > 0 && ` (${comments.length})`}
      </h2>

      {loadedViewer === undefined ? (
        <div className="h-14 rounded-lg bg-surface" aria-busy />
      ) : viewer ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Avatar name={viewer.displayName} url={viewer.avatarUrl} size={24} />
            <span>
              Commenting as <span className="font-medium text-ink">{viewer.displayName}</span>
            </span>
            <button
              type="button"
              disabled={signingOut}
              onClick={() =>
                startSignOut(async () => {
                  await createBrowserSupabase().auth.signOut();
                  router.refresh();
                })
              }
              className="text-subtle underline hover:text-ink disabled:opacity-50"
            >
              Sign out
            </button>
          </div>
          <CommentForm postId={postId} />
        </div>
      ) : (
        <div className="rounded-lg border border-line bg-surface px-4 py-4 text-sm text-muted">
          <Link
            href={`/login?next=${encodeURIComponent(here)}`}
            className="font-semibold text-accent hover:underline"
          >
            Sign in with GitHub or Google
          </Link>{" "}
          to join the discussion. Only your name and profile picture are shown.
        </div>
      )}

      {topLevel.length === 0 ? (
        <p className="text-sm text-subtle">No comments yet.</p>
      ) : (
        <ol className="space-y-6">
          {topLevel.map((comment) => (
            <li key={comment.id}>
              <CommentItem comment={comment} postId={postId} viewer={viewer}>
                {viewer && (
                  <button
                    type="button"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-sm text-subtle hover:text-ink"
                  >
                    Reply
                  </button>
                )}
              </CommentItem>

              {(repliesTo(comment.id).length > 0 || replyingTo === comment.id) && (
                <ol className="mt-4 ml-6 space-y-4 border-l-2 border-line pl-5 sm:ml-12">
                  {repliesTo(comment.id).map((reply) => (
                    <li key={reply.id}>
                      <CommentItem comment={reply} postId={postId} viewer={viewer} />
                    </li>
                  ))}
                  {viewer && replyingTo === comment.id && (
                    <li>
                      <CommentForm
                        postId={postId}
                        parentId={comment.id}
                        placeholder={`Reply to ${comment.author.displayName}…`}
                        submitLabel="Post reply"
                        autoFocus
                        onDone={() => setReplyingTo(null)}
                      />
                    </li>
                  )}
                </ol>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  postId,
  viewer,
  children,
}: {
  comment: PublicComment;
  postId: string;
  viewer: Viewer | null;
  children?: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isOwn = viewer?.id === comment.author.id;
  const canDelete = isOwn || viewer?.isAdmin;

  function run(action: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) setError(result.error);
    });
  }

  return (
    <article className={`flex gap-3 ${pending ? "opacity-50" : ""}`}>
      <Avatar name={comment.author.displayName} url={comment.author.avatarUrl} />
      <div className="min-w-0 grow">
        <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-semibold text-ink">{comment.author.displayName}</span>
          {comment.author.isSiteOwner && (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
              Author
            </span>
          )}
          <time dateTime={comment.createdAt} className="text-subtle">
            {formatDateTime(comment.createdAt)}
          </time>
        </div>
        <div className="mt-1">
          <CommentBody text={comment.body} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-4">
          {children}
          {viewer?.isAdmin && !isOwn && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => setCommentHidden(comment.id, postId, true))}
              className="text-sm text-subtle hover:text-ink"
            >
              Hide
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                const message = comment.parentId
                  ? "Delete this reply? This cannot be undone."
                  : "Delete this comment and its replies? This cannot be undone.";
                if (window.confirm(message)) run(() => deleteComment(comment.id, postId));
              }}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              Delete
            </button>
          )}
        </div>
        {error && (
          <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
