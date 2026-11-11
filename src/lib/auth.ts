import { cache } from "react";
import { createSessionClient } from "./supabase/server";

export interface CurrentUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  role: "user" | "admin";
}

/**
 * The signed-in visitor, or null. The session token is verified, and the role
 * comes from the profiles table, where it can only be changed in the SQL Editor.
 * Reads cookies, so call it inside a <Suspense> boundary.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createSessionClient();

  const { data: auth, error: authError } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (authError || !userId) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, role")
    .eq("id", userId)
    .maybeSingle();
  if (error || !profile) return null;

  return {
    id: userId,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    role: profile.role === "admin" ? "admin" : "user",
  };
});

export type AdminState =
  | { status: "signed-out" }
  | { status: "forbidden"; user: CurrentUser }
  | { status: "admin"; user: CurrentUser };

/** For admin pages: who is asking, and whether they may see admin content. */
export async function getAdminState(): Promise<AdminState> {
  const user = await getCurrentUser();
  if (!user) return { status: "signed-out" };
  if (user.role !== "admin") return { status: "forbidden", user };
  return { status: "admin", user };
}

/** For admin Server Functions: throws unless the caller is an admin. */
export async function requireAdmin(): Promise<CurrentUser> {
  const state = await getAdminState();
  if (state.status !== "admin") throw new Error("Not authorized");
  return state.user;
}
