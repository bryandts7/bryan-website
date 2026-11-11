"use server";

// Comment actions. Each one checks who is calling; the database rules check
// again (only visible comments on published posts, own comments only, admin
// for hiding, 2,000 characters, 5 comments per 10 minutes).

import { updateTag } from "next/cache";
import { isUuid } from "@/lib/admin-forms";
import { getCurrentUser } from "@/lib/auth";
import { COMMENT_MAX_LENGTH } from "@/lib/comment-limits";
import { createSessionClient } from "@/lib/supabase/server";

export interface CommentResult {
  error?: string;
}

const RELOAD = "Something went wrong. Reload the page and try again.";

function friendlyError(error: { code?: string; message: string }): string {
  switch (error.code) {
    case "P0001": // raised by the comments trigger: rate limit, reply depth
      return error.message;
    case "42501": // row-level security: post not published, or not allowed
      return "Comments are closed on this post.";
    case "23514": // body length check
      return `Comments must be 1 to ${COMMENT_MAX_LENGTH.toLocaleString("en-US")} characters.`;
    case "23503": // missing profile or post
      return "Your account isn't fully set up. Sign out, sign in again and retry.";
    default:
      return RELOAD;
  }
}

export async function addComment(input: {
  postId: string;
  parentId?: string | null;
  body: string;
}): Promise<CommentResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in to comment." };

  const { postId, parentId = null } = input;
  if (!isUuid(postId) || (parentId !== null && !isUuid(parentId))) return { error: RELOAD };

  const body = typeof input.body === "string" ? input.body.replace(/\r\n/g, "\n").trim() : "";
  if (!body) return { error: "Write something first." };
  if (body.length > COMMENT_MAX_LENGTH) {
    return {
      error: `Comments are limited to ${COMMENT_MAX_LENGTH.toLocaleString("en-US")} characters (this one has ${body.length.toLocaleString("en-US")}).`,
    };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("comments")
    .insert({ post_id: postId, parent_id: parentId, body });
  if (error) return { error: friendlyError(error) };

  updateTag(`comments:${postId}`);
  return {};
}

/** The author or the admin. Deleting a comment also deletes its replies. */
export async function deleteComment(id: string, postId: string): Promise<CommentResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in again." };
  if (!isUuid(id) || !isUuid(postId)) return { error: RELOAD };

  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("comments").delete().eq("id", id).select("id");
  if (error) return { error: friendlyError(error) };
  if (data.length === 0) return { error: "You can only delete your own comments." };

  updateTag(`comments:${postId}`);
  return {};
}

/** Admin only: hide a comment from everyone else, or show it again. */
export async function setCommentHidden(
  id: string,
  postId: string,
  hidden: boolean
): Promise<CommentResult> {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return { error: "Only the site owner can hide comments." };
  if (!isUuid(id) || !isUuid(postId)) return { error: RELOAD };

  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("comments")
    .update({ status: hidden ? "hidden" : "visible" })
    .eq("id", id)
    .select("id");
  if (error) return { error: friendlyError(error) };
  if (data.length === 0) return { error: "That comment no longer exists." };

  updateTag(`comments:${postId}`);
  return {};
}
