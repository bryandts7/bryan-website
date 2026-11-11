"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signOut } from "@/app/auth/actions";
import { deleteComment, setCommentHidden } from "@/app/comments/actions";
import type { PublicComment } from "@/lib/comments";
import { formatDateTime } from "@/lib/dates";
import Avatar from "./Avatar";
import CommentBody from "./CommentBody";
import CommentForm from "./CommentForm";

export interface Viewer {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  isAdmin: boolean;
}

export default function CommentThread({
  postId,
  slug,
  comments,
  viewer,
}: {
  postId: string;
  slug: string;
  comments: PublicComment[];
  viewer: Viewer | null;
}) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const topLevel = comments.filter((comment) => !comment.parentId);
  const repliesTo = (id: string) => comments.filter((comment) => comment.parentId === id);
  const here = `/blog/${slug}#comments`;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-stone-900">
        Comments{comments.length > 0 && ` (${comments.length})`}
      </h2>

      {viewer ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <Avatar name={viewer.displayName} url={viewer.avatarUrl} size={24} />
            <span>
              Commenting as <span className="font-medium text-gray-900">{viewer.displayName}</span>
            </span>
            <form action={signOut}>
              <input type="hidden" name="next" value={here} />
              <button type="submit" className="text-gray-500 underline hover:text-gray-800">
                Sign out
              </button>
            </form>
          </div>
          <CommentForm postId={postId} />
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-700">
          <Link
            href={`/login?next=${encodeURIComponent(here)}`}
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign in with GitHub or Google
          </Link>{" "}
          to join the discussion. Only your name and profile picture are shown.
        </div>
      )}

      {topLevel.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet.</p>
      ) : (
        <ol className="space-y-6">
          {topLevel.map((comment) => (
            <li key={comment.id}>
              <CommentItem comment={comment} postId={postId} viewer={viewer}>
                {viewer && (
                  <button
                    type="button"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Reply
                  </button>
                )}
              </CommentItem>

              {(repliesTo(comment.id).length > 0 || replyingTo === comment.id) && (
                <ol className="mt-4 ml-6 space-y-4 border-l-2 border-gray-100 pl-5 sm:ml-12">
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
          <span className="font-semibold text-gray-900">{comment.author.displayName}</span>
          {comment.author.isSiteOwner && (
            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-medium text-white">
              Author
            </span>
          )}
          <time dateTime={comment.createdAt} className="text-gray-500">
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
              className="text-sm text-gray-500 hover:text-gray-900"
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
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          )}
        </div>
        {error && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
