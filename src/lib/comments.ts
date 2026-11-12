import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";

export interface PublicComment {
  id: string;
  parentId: string | null;
  body: string;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    isSiteOwner: boolean;
  };
}

interface CommentRow {
  id: string;
  parent_id: string | null;
  body: string;
  created_at: string;
  user_id: string;
  profiles: { display_name: string; avatar_url: string | null; role: string } | null;
}

/**
 * Visible comments on a published post, oldest first. Read anonymously, so
 * hidden comments never appear. Tagged so posting, deleting or hiding a
 * comment refreshes it at once.
 */
export async function getComments(postId: string): Promise<PublicComment[]> {
  "use cache";
  // Posting, deleting and hiding refresh this at once through the tag; the
  // lifetime only matters for changes made elsewhere (e.g. a renamed profile).
  cacheLife("hours");
  cacheTag(`comments:${postId}`);

  const { data, error } = await createPublicClient()
    .from("comments")
    .select("id, parent_id, body, created_at, user_id, profiles(display_name, avatar_url, role)")
    .eq("post_id", postId)
    .eq("status", "visible")
    .order("created_at", { ascending: true })
    .limit(500)
    .overrideTypes<CommentRow[], { merge: false }>();
  if (error) throw new Error(`Could not load comments: ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    parentId: row.parent_id,
    body: row.body,
    createdAt: row.created_at,
    author: {
      id: row.user_id,
      displayName: row.profiles?.display_name ?? "Deleted user",
      avatarUrl: row.profiles?.avatar_url ?? null,
      isSiteOwner: row.profiles?.role === "admin",
    },
  }));
}
