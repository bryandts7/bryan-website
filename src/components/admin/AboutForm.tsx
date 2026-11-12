"use client";

import Link from "next/link";
import { saveAbout } from "@/app/admin/actions";
import { FormMessage, MarkDirtyContext, SaveBar, useAdminForm } from "./form";
import MarkdownEditor from "./MarkdownEditor";

export default function AboutForm({ value }: { value: string }) {
  const { state, pending, dirty, markDirty, formProps } = useAdminForm(saveAbout);
  const errors = state.fieldErrors ?? {};

  return (
    <MarkDirtyContext value={markDirty}>
      <form {...formProps} className="space-y-6" noValidate>
        <FormMessage state={state} />
        <MarkdownEditor
          label="About me (home page)"
          name="value_md"
          defaultValue={value}
          folder="posts"
          error={errors.value_md}
          rows={18}
          previewClassName="prose max-w-none"
          hint="Markdown. Separate paragraphs with a blank line; **bold** for emphasis."
        />
        <SaveBar pending={pending} dirty={dirty}>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            View home page
          </Link>
        </SaveBar>
      </form>
    </MarkDirtyContext>
  );
}
