import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";

// Public content, read from Supabase and cached by Next.js.
// Each reader is tagged so the admin console can refresh it right after an edit.

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  published_at: string | null;
}

export interface Post extends PostSummary {
  id: string;
  content_md: string;
  cover_image_url: string | null;
  tags: string[];
}

export interface Project {
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
}

export interface Experience {
  id: string;
  kind: "work" | "academic";
  period: string;
  title: string;
  organization: string;
  logo_url: string | null;
  details: string;
}

function fail(what: string, message: string): never {
  throw new Error(`Could not load ${what} from Supabase: ${message}`);
}

export async function getPosts(): Promise<PostSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const { data, error } = await createPublicClient()
    .from("posts")
    .select("slug, title, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) fail("posts", error.message);
  return data;
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts", `post:${slug}`);

  const { data, error } = await createPublicClient()
    .from("posts")
    .select("id, slug, title, excerpt, content_md, cover_image_url, tags, published_at")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) fail(`post "${slug}"`, error.message);
  return data;
}

const PROJECT_COLUMNS =
  "id, slug, title, description, content_md, image_url, image_width, image_height, technologies, github_url, paper_url, demo_url, is_interactive";

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");

  const { data, error } = await createPublicClient()
    .from("projects")
    .select(PROJECT_COLUMNS)
    .eq("status", "published")
    .order("sort_order")
    .order("created_at");
  if (error) fail("projects", error.message);
  return data;
}

export async function getProject(slug: string): Promise<Project | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects", `project:${slug}`);

  const { data, error } = await createPublicClient()
    .from("projects")
    .select(PROJECT_COLUMNS)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) fail(`project "${slug}"`, error.message);
  return data;
}

export async function getExperiences(): Promise<Experience[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("experiences");

  const { data, error } = await createPublicClient()
    .from("experiences")
    .select("id, kind, period, title, organization, logo_url, details")
    .order("sort_order")
    .order("created_at");
  if (error) fail("experiences", error.message);
  return data;
}

/** A Markdown text block such as "about_me"; empty string if it does not exist. */
export async function getSiteContent(key: string): Promise<string> {
  "use cache";
  cacheLife("hours");
  cacheTag("site_content", `site_content:${key}`);

  const { data, error } = await createPublicClient()
    .from("site_content")
    .select("value_md")
    .eq("key", key)
    .maybeSingle();
  if (error) fail(`site content "${key}"`, error.message);
  return data?.value_md ?? "";
}

export { formatDate } from "./dates";
