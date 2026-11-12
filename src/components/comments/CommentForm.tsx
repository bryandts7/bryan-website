"use client";

import { useState, useTransition } from "react";
import { addComment } from "@/app/comments/actions";
import { COMMENT_MAX_LENGTH } from "@/lib/comment-limits";

export default function CommentForm({
  postId,
  parentId = null,
  placeholder = "Write a comment…",
  submitLabel = "Post comment",
  autoFocus = false,
  onDone,
}: {
  postId: string;
  parentId?: string | null;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  /** Called after posting, and when a reply is cancelled. */
  onDone?: () => void;
}) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const length = body.trim().length;
  const tooLong = length > COMMENT_MAX_LENGTH;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!length || tooLong) return;
        setError(null);
        startTransition(async () => {
          const result = await addComment({ postId, parentId, body });
          if (result.error) {
            setError(result.error);
          } else {
            setBody("");
            onDone?.();
          }
        });
      }}
      className="space-y-2"
    >
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={placeholder}
        rows={parentId ? 3 : 4}
        autoFocus={autoFocus}
        aria-label={parentId ? "Reply" : "Comment"}
        className="block w-full resize-y rounded-md border border-line bg-card px-3 py-2 text-sm text-ink shadow-xs focus:border-accent focus:outline-hidden focus:ring-2 focus:ring-accent/30"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending || !length || tooLong}
          className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Posting…" : submitLabel}
        </button>
        {parentId && onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-sm text-muted hover:text-ink"
          >
            Cancel
          </button>
        )}
        <span className={`ml-auto text-xs ${tooLong ? "text-red-600 dark:text-red-400" : "text-subtle"}`}>
          {length.toLocaleString("en-US")} / {COMMENT_MAX_LENGTH.toLocaleString("en-US")}
        </span>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
