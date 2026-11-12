"use client";

import { useFormStatus } from "react-dom";
import { buttonClass } from "./form";

function Button() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${buttonClass} border border-red-300 bg-white text-red-700 hover:bg-red-50`}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

/** A separate small form, so it never submits the edit form's fields. */
export default function DeleteButton({
  action,
  id,
  confirmText,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  confirmText: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmText)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button />
    </form>
  );
}
