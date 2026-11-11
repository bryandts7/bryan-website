import { isUuid } from "./admin-forms";
import { createSessionClient } from "./supabase/server";

// Reads for the admin console. They run as the signed-in user, so row-level
// security decides what comes back (drafts are only visible to the admin).
// Never cached: the admin must always see the latest data.

export interface AdminPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  cover_image_url: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
}

export interface AdminProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_md: string;
  image_url: string | null;
  image_width: number | null;
  image_height: number | null;
  technologies: string[];
  github_url: string | null;
  paper_url: string | null;
  demo_url: string | null;
  is_interactive: boolean;
  sort_order: number;
  status: "draft" | "published";
  updated_at: string;
}

export interface AdminExperience {
  id: string;
  kind: "work" | "academic";
  period: string;
  title: string;
  organization: string;
  logo_url: string | null;
  details: string;
  sort_order: number;
  updated_at: string;
}

function fail(what: string, message: string): never {
  throw new Error(`Could not load ${what}: ${message}`);
}

export async function adminListPosts() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, status, published_at, updated_at")
    .order("published_at", { ascending: false, nullsFirst: true })
    .order("created_at", { ascending: false });
  if (error) fail("posts", error.message);
  return data;
}

export async function adminGetPost(id: string): Promise<AdminPost | null> {
  if (!isUuid(id)) return null;
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, content_md, cover_image_url, tags, status, published_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error) fail("the post", error.message);
  return data;
}

export async function adminListProjects() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, title, status, sort_order, image_url, updated_at")
    .order("sort_order")
    .order("created_at");
  if (error) fail("projects", error.message);
  return data;
}

export async function adminGetProject(id: string): Promise<AdminProject | null> {
  if (!isUuid(id)) return null;
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, description, content_md, image_url, image_width, image_height, technologies, github_url, paper_url, demo_url, is_interactive, sort_order, status, updated_at"
    )
    .eq("id", id)
    .maybeSingle();
  if (error) fail("the project", error.message);
  return data;
}

export async function adminListExperiences() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("id, kind, period, title, organization, sort_order")
    .order("sort_order")
    .order("created_at");
  if (error) fail("experience entries", error.message);
  return data;
}

export async function adminGetExperience(id: string): Promise<AdminExperience | null> {
  if (!isUuid(id)) return null;
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("id, kind, period, title, organization, logo_url, details, sort_order, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error) fail("the experience entry", error.message);
  return data;
}

export interface AdminComment {
  id: string;
  body: string;
  status: "visible" | "hidden";
  created_at: string;
  parent_id: string | null;
  post_id: string;
  posts: { title: string; slug: string; status: string } | null;
  profiles: { display_name: string } | null;
}

/** Newest first, hidden ones included (only the admin can read those). */
export async function adminListComments(status: "all" | "visible" | "hidden" = "all") {
  const supabase = await createSessionClient();
  let query = supabase
    .from("comments")
    .select("id, body, status, created_at, parent_id, post_id, posts(title, slug, status), profiles(display_name)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status !== "all") query = query.eq("status", status);
  const { data, error } = await query.overrideTypes<AdminComment[], { merge: false }>();
  if (error) fail("comments", error.message);
  return data;
}

export async function adminGetAbout(): Promise<{ value_md: string; updated_at: string | null }> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("value_md, updated_at")
    .eq("key", "about_me")
    .maybeSingle();
  if (error) fail("the About-me text", error.message);
  return data ?? { value_md: "", updated_at: null };
}
