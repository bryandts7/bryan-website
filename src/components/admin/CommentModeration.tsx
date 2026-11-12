"use client";

import { useState, useTransition } from "react";
import { deleteComment, setCommentHidden } from "@/app/comments/actions";
import { buttonClass } from "./form";

/** Hide / show / delete buttons for one comment in the admin list. */
export default function CommentModeration({
  id,
  postId,
  status,
}: {
  id: string;
  postId: string;
  status: "visible" | "hidden";
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => setCommentHidden(id, postId, status === "visible"))}
        className={`${buttonClass} border border-gray-300 bg-white px-3 py-1.5 text-gray-800 hover:bg-gray-100`}
      >
        {status === "visible" ? "Hide" : "Show again"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (window.confirm("Delete this comment and any replies to it? This cannot be undone.")) {
            run(() => deleteComment(id, postId));
          }
        }}
        className={`${buttonClass} border border-red-300 bg-white px-3 py-1.5 text-red-700 hover:bg-red-50`}
      >
        Delete
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
