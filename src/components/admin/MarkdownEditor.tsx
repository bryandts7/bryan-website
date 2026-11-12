"use client";

import { useDeferredValue, useId, useRef, useState } from "react";
import MarkdownContent from "@/components/MarkdownContent";
import { IMAGE_ACCEPT, uploadImage, type MediaFolder } from "@/lib/upload";
import { buttonClass, useMarkDirty } from "./form";

type Mode = "split" | "write" | "preview";

const modes: { id: Mode; label: string }[] = [
  { id: "split", label: "Side by side" },
  { id: "write", label: "Write" },
  { id: "preview", label: "Preview" },
];

/**
 * Where an inserted image goes: never inside a line. At the start of the
 * cursor's line when the cursor sits at a line start, otherwise after the end
 * of the cursor's line; at the very end when the editor was never clicked.
 */
export function imageInsertPosition(
  value: string,
  cursor: { start: number; end: number } | null
): number {
  if (!cursor) return value.length;
  const { start, end } = cursor;
  if (start === end && (start === 0 || value[start - 1] === "\n")) return start;
  const lineEnd = value.indexOf("\n", end);
  return lineEnd === -1 ? value.length : lineEnd;
}

/**
 * Markdown textarea with a live preview (math, tables, Mermaid) and an
 * "Insert image" button that uploads and inserts ![alt](url) at the cursor.
 */
export default function MarkdownEditor({
  label,
  name,
  defaultValue,
  folder,
  error,
  hint,
  rows = 24,
  previewClassName = "prose prose-lg max-w-none",
}: {
  label: string;
  name: string;
  defaultValue: string;
  folder: MediaFolder;
  error?: string;
  hint?: string;
  rows?: number;
  previewClassName?: string;
}) {
  const textareaId = useId();
  const fileId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Where the cursor was last in the textarea; null until it has been used,
  // in which case an inserted image goes at the end.
  const cursorRef = useRef<{ start: number; end: number } | null>(null);
  const markDirty = useMarkDirty();
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<Mode>("split");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const preview = useDeferredValue(value);

  async function insertImage(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const { url } = await uploadImage(file, folder);
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[[\]]/g, "");
      const at = imageInsertPosition(value, cursorRef.current);
      const before = value.slice(0, at);
      const after = value.slice(at);

      // The image gets a paragraph of its own: on the same line as a heading,
      // list item or link it would break that line.
      const lead = before === "" || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
      const trail = after === "" || after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
      const snippet = `${lead}![${alt}](${url})${trail}`;

      setValue(`${before}${snippet}${after}`);
      markDirty();
      const caret = at + snippet.length;
      cursorRef.current = { start: caret, end: caret };
      const textarea = textareaRef.current;
      requestAnimationFrame(() => {
        textarea?.focus();
        textarea?.setSelectionRange(caret, caret);
      });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const showEditor = mode !== "preview";
  const showPreview = mode !== "write";
  const message = uploadError ?? error;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id={fileId}
            type="file"
            accept={IMAGE_ACCEPT}
            className="sr-only"
            onChange={(event) => {
              insertImage(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <label
            htmlFor={fileId}
            className={`${buttonClass} cursor-pointer border border-gray-300 bg-white px-3 py-1.5 text-gray-800 hover:bg-gray-100 ${uploading ? "pointer-events-none opacity-60" : ""}`}
          >
            {uploading ? "Uploading…" : "Insert image"}
          </label>
          <div className="inline-flex overflow-hidden rounded-md border border-gray-300" role="group">
            {modes.map(({ id, label: modeLabel }) => (
              <button
                key={id}
                type="button"
                aria-pressed={mode === id}
                onClick={() => setMode(id)}
                className={`px-3 py-1.5 text-sm ${mode === id ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              >
                {modeLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`mt-2 grid gap-4 ${mode === "split" ? "lg:grid-cols-2" : ""}`}>
        {/* Kept mounted (only hidden) in preview mode so the value is still submitted. */}
        <textarea
          ref={textareaRef}
          id={textareaId}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onSelect={(event) => {
            const { selectionStart, selectionEnd } = event.currentTarget;
            cursorRef.current = { start: selectionStart, end: selectionEnd };
          }}
          rows={rows}
          spellCheck
          className={`block w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm leading-6 text-gray-900 shadow-xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200 ${showEditor ? "" : "hidden"}`}
        />
        {showPreview && (
          <div className="max-h-[48rem] min-h-40 overflow-auto rounded-md border border-gray-200 bg-white px-5 py-4">
            {preview.trim() ? (
              <div className={previewClassName}>
                <MarkdownContent>{preview}</MarkdownContent>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      {hint && !message && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {message && <p className="mt-1 text-sm text-red-600">{message}</p>}
    </div>
  );
}
