"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteProject, saveProject } from "@/app/admin/actions";
import type { AdminProject } from "@/lib/admin-data";
import { slugify } from "@/lib/slug";
import DeleteButton from "./DeleteButton";
import { Field, FormMessage, inputClass, MarkDirtyContext, SaveBar, useAdminForm } from "./form";
import ImageField from "./ImageField";
import MarkdownEditor from "./MarkdownEditor";

export default function ProjectForm({
  project,
  nextSortOrder = 0,
}: {
  project?: AdminProject;
  nextSortOrder?: number;
}) {
  const { state, pending, dirty, markDirty, formProps } = useAdminForm(saveProject);
  const errors = state.fieldErrors ?? {};

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(project));

  return (
    <MarkDirtyContext value={markDirty}>
      <form {...formProps} className="space-y-6" noValidate>
        <FormMessage state={state} />
        {project && <input type="hidden" name="id" value={project.id} />}

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
            hint={`Address: /portfolio/${slug || "…"}`}
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
          label="Short description"
          htmlFor="description"
          error={errors.description}
          hint="Shown on the project card."
        >
          <textarea
            id="description"
            name="description"
            defaultValue={project?.description}
            rows={2}
            className={inputClass}
          />
        </Field>

        <Field
          label="Technologies"
          htmlFor="technologies"
          error={errors.technologies}
          hint="Comma separated, e.g. Python, PyTorch, LoRA"
        >
          <input
            id="technologies"
            name="technologies"
            defaultValue={project?.technologies.join(", ")}
            className={inputClass}
          />
        </Field>

        <ImageField
          label="Image"
          name="image_url"
          widthName="image_width"
          heightName="image_height"
          folder="projects"
          defaultUrl={project?.image_url}
          defaultWidth={project?.image_width}
          defaultHeight={project?.image_height}
          error={errors.image_url}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <Field label="GitHub link" htmlFor="github_url" error={errors.github_url}>
            <input
              id="github_url"
              name="github_url"
              type="url"
              defaultValue={project?.github_url ?? ""}
              placeholder="https://github.com/…"
              className={inputClass}
            />
          </Field>
          <Field label="Paper link" htmlFor="paper_url" error={errors.paper_url}>
            <input
              id="paper_url"
              name="paper_url"
              type="url"
              defaultValue={project?.paper_url ?? ""}
              placeholder="https://…"
              className={inputClass}
            />
          </Field>
          <Field
            label="Demo link"
            htmlFor="demo_url"
            error={errors.demo_url}
            hint="A full URL, or a page here such as /translator"
          >
            <input
              id="demo_url"
              name="demo_url"
              defaultValue={project?.demo_url ?? ""}
              placeholder="https://… or /translator"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Status" htmlFor="status" error={errors.status}>
            <select
              id="status"
              name="status"
              defaultValue={project?.status ?? "published"}
              className={inputClass}
            >
              <option value="published">Published</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </Field>
          <Field
            label="Order"
            htmlFor="sort_order"
            error={errors.sort_order}
            hint="Lower numbers come first."
          >
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              step={1}
              defaultValue={project?.sort_order ?? nextSortOrder}
              className={inputClass}
            />
          </Field>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="is_interactive"
              name="is_interactive"
              type="checkbox"
              defaultChecked={project?.is_interactive ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="is_interactive" className="text-sm text-gray-700">
              Interactive (shows a &ldquo;Try Interactive&rdquo; button)
            </label>
          </div>
        </div>

        <MarkdownEditor
          label="Details"
          name="content_md"
          defaultValue={project?.content_md ?? ""}
          folder="projects"
          error={errors.content_md}
          rows={14}
          hint="Shown on the project page. Markdown."
        />

        <SaveBar pending={pending} dirty={dirty} label={project ? "Save changes" : "Create project"}>
          {project?.status === "published" && (
            <Link href={`/portfolio/${project.slug}`} className="text-sm text-blue-600 hover:underline">
              View on site
            </Link>
          )}
        </SaveBar>
      </form>

      {project && (
        <div className="mt-10 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-white p-4">
          <p className="text-sm text-gray-600">Deleting removes the project. This cannot be undone.</p>
          <DeleteButton
            action={deleteProject}
            id={project.id}
            confirmText={`Delete "${project.title}"? This cannot be undone.`}
          />
        </div>
      )}
    </MarkDirtyContext>
  );
}
