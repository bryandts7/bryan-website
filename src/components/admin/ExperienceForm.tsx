"use client";

import { deleteExperience, saveExperience } from "@/app/admin/actions";
import type { AdminExperience } from "@/lib/admin-data";
import DeleteButton from "./DeleteButton";
import { Field, FormMessage, inputClass, MarkDirtyContext, SaveBar, useAdminForm } from "./form";
import ImageField from "./ImageField";

export default function ExperienceForm({
  experience,
  defaultKind = "work",
}: {
  experience?: AdminExperience;
  defaultKind?: "work" | "academic";
}) {
  const { state, pending, dirty, markDirty, formProps } = useAdminForm(saveExperience);
  const errors = state.fieldErrors ?? {};

  return (
    <MarkDirtyContext value={markDirty}>
      <form {...formProps} className="space-y-6" noValidate>
        <FormMessage state={state} />
        {experience && <input type="hidden" name="id" value={experience.id} />}

        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Section" htmlFor="kind" error={errors.kind}>
            <select
              id="kind"
              name="kind"
              defaultValue={experience?.kind ?? defaultKind}
              className={inputClass}
            >
              <option value="work">Industry experience</option>
              <option value="academic">Academia experience</option>
            </select>
          </Field>
          <Field label="Period" htmlFor="period" error={errors.period} hint="e.g. Mar 2025 - Current">
            <input
              id="period"
              name="period"
              defaultValue={experience?.period}
              className={inputClass}
              required
            />
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
              defaultValue={experience?.sort_order ?? 0}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Role or degree" htmlFor="title" error={errors.title}>
            <input
              id="title"
              name="title"
              defaultValue={experience?.title}
              className={inputClass}
              required
            />
          </Field>
          <Field
            label="Organization"
            htmlFor="organization"
            error={errors.organization}
            hint="e.g. Pixalate (Virginia, United States)"
          >
            <input
              id="organization"
              name="organization"
              defaultValue={experience?.organization}
              className={inputClass}
            />
          </Field>
        </div>

        <ImageField
          label="Logo (optional)"
          name="logo_url"
          folder="logos"
          defaultUrl={experience?.logo_url}
          error={errors.logo_url}
        />

        <Field label="Details" htmlFor="details" error={errors.details}>
          <textarea
            id="details"
            name="details"
            defaultValue={experience?.details}
            rows={4}
            className={inputClass}
          />
        </Field>

        <SaveBar pending={pending} dirty={dirty} label={experience ? "Save changes" : "Add entry"} />
      </form>

      {experience && (
        <div className="mt-10 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-white p-4">
          <p className="text-sm text-gray-600">Deleting removes this entry. This cannot be undone.</p>
          <DeleteButton
            action={deleteExperience}
            id={experience.id}
            confirmText={`Delete "${experience.title}"? This cannot be undone.`}
          />
        </div>
      )}
    </MarkDirtyContext>
  );
}
