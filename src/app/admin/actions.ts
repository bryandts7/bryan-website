"use server";

// Every function here is reachable by a direct POST, so each one checks the
// admin role itself. The database's row-level security checks it again.

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { dbErrorToState, FormReader, isUuid, type FormState } from "@/lib/admin-forms";
import { getAdminState, requireAdmin } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

const NOT_ADMIN: FormState = {
  error: "You are not signed in as the admin. Sign in again, then save.",
};

async function isAdmin(): Promise<boolean> {
  return (await getAdminState()).status === "admin";
}

/** For delete buttons: the id from the form, after checking the caller. */
async function adminDeleteTarget(formData: FormData): Promise<string> {
  await requireAdmin();
  const id = formData.get("id");
  if (!isUuid(id)) throw new Error("Invalid id");
  return id;
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return NOT_ADMIN;

  const form = new FormReader(formData);
  const id = form.optionalId();
  const row = {
    title: form.text("title", { required: true, max: 200 }),
    slug: form.slug("slug"),
    excerpt: form.text("excerpt", { max: 500 }),
    content_md: form.text("content_md", { max: 200_000, multiline: true }),
    title_id: form.optionalText("title_id", { max: 200 }),
    excerpt_id: form.optionalText("excerpt_id", { max: 500 }),
    content_md_id: form.optionalText("content_md_id", { max: 200_000, multiline: true }),
    tags: form.list("tags", { maxItems: 10, maxLength: 40 }),
    cover_image_url: form.imageUrl("cover_image_url"),
    status: form.oneOf("status", ["draft", "published"] as const),
  };
  if (form.hasErrors) return form.state();

  const supabase = await createSessionClient();
  const result = id
    ? await supabase.from("posts").update(row).eq("id", id).select("id").single()
    : await supabase.from("posts").insert(row).select("id").single();
  if (result.error) return dbErrorToState(result.error, "post");

  updateTag("posts");
  redirect(`/admin/posts/${result.data.id}?saved=1`);
}

export async function deletePost(formData: FormData) {
  const id = await adminDeleteTarget(formData);
  const supabase = await createSessionClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(`Could not delete the post: ${error.message}`);

  updateTag("posts");
  redirect("/admin/posts?deleted=1");
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return NOT_ADMIN;

  const form = new FormReader(formData);
  const id = form.optionalId();
  const row = {
    title: form.text("title", { required: true, max: 200 }),
    slug: form.slug("slug"),
    description: form.text("description", { max: 500 }),
    content_md: form.text("content_md", { max: 100_000, multiline: true }),
    title_id: form.optionalText("title_id", { max: 200 }),
    description_id: form.optionalText("description_id", { max: 500 }),
    content_md_id: form.optionalText("content_md_id", { max: 100_000, multiline: true }),
    technologies: form.list("technologies", { maxItems: 15, maxLength: 40 }),
    image_url: form.imageUrl("image_url"),
    image_width: form.optionalPositiveInt("image_width"),
    image_height: form.optionalPositiveInt("image_height"),
    github_url: form.link("github_url"),
    paper_url: form.link("paper_url"),
    demo_url: form.link("demo_url"),
    is_interactive: form.checkbox("is_interactive"),
    kind: form.oneOf("kind", ["personal", "work"] as const),
    organization: form.text("organization", { max: 100 }),
    external_url: form.link("external_url"),
    sort_order: form.int("sort_order"),
    status: form.oneOf("status", ["draft", "published"] as const),
  };
  if (form.hasErrors) return form.state();

  const supabase = await createSessionClient();
  const result = id
    ? await supabase.from("projects").update(row).eq("id", id).select("id").single()
    : await supabase.from("projects").insert(row).select("id").single();
  if (result.error) return dbErrorToState(result.error, "project");

  updateTag("projects");
  redirect(`/admin/projects/${result.data.id}?saved=1`);
}

export async function deleteProject(formData: FormData) {
  const id = await adminDeleteTarget(formData);
  const supabase = await createSessionClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(`Could not delete the project: ${error.message}`);

  updateTag("projects");
  redirect("/admin/projects?deleted=1");
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export async function saveExperience(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return NOT_ADMIN;

  const form = new FormReader(formData);
  const id = form.optionalId();
  const row = {
    kind: form.oneOf("kind", ["work", "academic", "research"] as const),
    period: form.text("period", { required: true, max: 60 }),
    title: form.text("title", { required: true, max: 200 }),
    organization: form.text("organization", { max: 200 }),
    logo_url: form.imageUrl("logo_url"),
    details: form.text("details", { max: 2000 }),
    period_id: form.optionalText("period_id", { max: 60 }),
    title_id: form.optionalText("title_id", { max: 200 }),
    details_id: form.optionalText("details_id", { max: 2000 }),
    sort_order: form.int("sort_order"),
  };
  if (form.hasErrors) return form.state();

  const supabase = await createSessionClient();
  const result = id
    ? await supabase.from("experiences").update(row).eq("id", id).select("id").single()
    : await supabase.from("experiences").insert(row).select("id").single();
  if (result.error) return dbErrorToState(result.error, "experience entry");

  updateTag("experiences");
  redirect(`/admin/experiences/${result.data.id}?saved=1`);
}

export async function deleteExperience(formData: FormData) {
  const id = await adminDeleteTarget(formData);
  const supabase = await createSessionClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(`Could not delete the experience entry: ${error.message}`);

  updateTag("experiences");
  redirect("/admin/experiences?deleted=1");
}

// ---------------------------------------------------------------------------
// About me (home page text)
// ---------------------------------------------------------------------------

export async function saveAbout(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return NOT_ADMIN;

  const form = new FormReader(formData);
  const value_md = form.text("value_md", { required: true, max: 20_000, multiline: true });
  // Indonesian version; saving it empty clears it (the English then shows).
  const value_md_id = form.optionalText("value_md_id", { max: 20_000, multiline: true }) ?? "";
  if (form.hasErrors) return form.state();

  const supabase = await createSessionClient();
  const { error } = await supabase.from("site_content").upsert(
    [
      { key: "about_me", value_md },
      { key: "about_me_id", value_md: value_md_id },
    ],
    { onConflict: "key" }
  );
  if (error) return dbErrorToState(error, "About-me text");

  updateTag("site_content");
  redirect("/admin/about?saved=1");
}
