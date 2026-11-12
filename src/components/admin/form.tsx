"use client";

import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { FormState } from "@/lib/admin-forms";

/**
 * Lets fields that change their value from code (an image upload, an inserted
 * image link) mark the form as having unsaved changes.
 */
export const MarkDirtyContext = createContext<() => void>(() => {});
export const useMarkDirty = () => useContext(MarkDirtyContext);

export const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200";

export const buttonClass =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

/**
 * Wires a form to an admin Server Function.
 * - Submits without React's automatic form reset, so a validation error never
 *   wipes what was typed.
 * - Warns before closing or reloading the tab with unsaved changes.
 *   (Give the form a `key` that changes after a save to clear the warning.)
 */
export function useAdminForm(action: Action) {
  const [state, dispatch, pending] = useActionState(action, {});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const markDirty = () => setDirty(true);

  const formProps = {
    onChange: markDirty,
    onSubmit: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      startTransition(() => dispatch(formData));
    },
  };

  return { state, pending, dirty, markDirty, formProps };
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state.error) return null;
  return (
    <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {state.error}
    </div>
  );
}

export function SaveBar({
  pending,
  dirty,
  label = "Save",
  children,
}: {
  pending: boolean;
  dirty: boolean;
  label?: string;
  children?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-gray-200 bg-gray-50/95 px-4 py-3 backdrop-blur">
      <button
        type="submit"
        disabled={pending}
        className={`${buttonClass} bg-gray-900 text-white hover:bg-gray-700`}
      >
        {pending ? "Saving…" : label}
      </button>
      {dirty && !pending && <span className="text-sm text-gray-500">Unsaved changes</span>}
      <div className="ml-auto flex items-center gap-3">{children}</div>
    </div>
  );
}
