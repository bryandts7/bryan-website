"use client";

import Link from "next/link";
import { useState } from "react";
import { deletePost, savePost } from "@/app/admin/actions";
import type { AdminPost } from "@/lib/admin-data";
import { formatDate } from "@/lib/dates";
import { slugify } from "@/lib/slug";
import DeleteButton from "./DeleteButton";
import { Field, FormMessage, inputClass, MarkDirtyContext, SaveBar, useAdminForm } from "./form";
import ImageField from "./ImageField";
import MarkdownEditor from "./MarkdownEditor";

export default function PostForm({ post }: { post?: AdminPost }) {
  const { state, pending, dirty, markDirty, formProps } = useAdminForm(savePost);
  const errors = state.fieldErrors ?? {};

  // The slug follows the title for new posts until it is edited by hand.
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post));

  return (
    <MarkDirtyContext value={markDirty}>
      <form {...formProps} className="space-y-6" noValidate>
        <FormMessage state={state} />
        {post && <input type="hidden" name="id" value={post.id} />}

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Title" htmlFor="title" error={errors.title}>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slugEdited) setSlug(slugify(event.target.value));
              }}
              className={inputClass}
              required
            />
          </Field>
          <Field
            label="Slug"
            htmlFor="slug"
            error={errors.slug}
            hint={`Address: /blog/${slug || "…"}`}
          >
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugEdited(true);
              }}
              className={`${inputClass} font-mono`}
              required
            />
          </Field>
        </div>

        <Field
          label="Excerpt"
          htmlFor="excerpt"
          error={errors.excerpt}
          hint="Shown on the blog list and in search results."
        >
          <textarea
            id="excerpt"
            name="excerpt"
            defaultValue={post?.excerpt}
            rows={2}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Tags" htmlFor="tags" error={errors.tags} hint="Comma separated, e.g. statistics, ML">
            <input
              id="tags"
              name="tags"
              defaultValue={post?.tags.join(", ")}
              className={inputClass}
            />
          </Field>
          <Field
            label="Status"
            htmlFor="status"
            error={errors.status}
            hint={
              post?.published_at
                ? `First published ${formatDate(post.published_at)}`
                : "The publish date is set the first time it is published."
            }
          >
            <select
              id="status"
              name="status"
              defaultValue={post?.status ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Draft (only you can see it)</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>

        <ImageField
          label="Cover image (optional)"
          name="cover_image_url"
          folder="posts"
          defaultUrl={post?.cover_image_url}
          error={errors.cover_image_url}
          hint="Shown at the top of the post and in link previews."
        />

        <MarkdownEditor
          label="Content"
          name="content_md"
          defaultValue={post?.content_md ?? ""}
          folder="posts"
          error={errors.content_md}
          hint="Markdown. Math: $$ x^2 $$. Diagrams: a ```mermaid code block."
        />

        <SaveBar pending={pending} dirty={dirty} label={post ? "Save changes" : "Create post"}>
          {post?.status === "published" && (
            <Link href={`/blog/${post.slug}`} className="text-sm text-blue-600 hover:underline">
              View on site
            </Link>
          )}
        </SaveBar>
      </form>

      {post && (
        <div className="mt-10 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-white p-4">
          <p className="text-sm text-gray-600">
            Deleting removes the post and all of its comments. This cannot be undone.
          </p>
          <DeleteButton
            action={deletePost}
            id={post.id}
            confirmText={`Delete "${post.title}" and all its comments? This cannot be undone.`}
          />
        </div>
      )}
    </MarkDirtyContext>
  );
}
