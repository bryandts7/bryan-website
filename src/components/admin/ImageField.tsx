"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { IMAGE_ACCEPT, uploadImage, type MediaFolder } from "@/lib/upload";
import { buttonClass, useMarkDirty } from "./form";

/**
 * Upload one image to the media bucket. Submits its public URL in `name`, and
 * (optionally) its pixel size in `widthName` / `heightName`.
 */
export default function ImageField({
  label,
  name,
  folder,
  defaultUrl,
  defaultWidth,
  defaultHeight,
  widthName,
  heightName,
  error,
  hint,
}: {
  label: string;
  name: string;
  folder: MediaFolder;
  defaultUrl?: string | null;
  defaultWidth?: number | null;
  defaultHeight?: number | null;
  widthName?: string;
  heightName?: string;
  error?: string;
  hint?: string;
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const markDirty = useMarkDirty();
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [size, setSize] = useState({ width: defaultWidth ?? null, height: defaultHeight ?? null });
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setUploadError(null);
    try {
      const uploaded = await uploadImage(file, folder);
      setUrl(uploaded.url);
      setSize({ width: uploaded.width, height: uploaded.height });
      markDirty();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const message = uploadError ?? error;

  return (
    <div>
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <input type="hidden" name={name} value={url} />
      {widthName && <input type="hidden" name={widthName} value={size.width ?? ""} />}
      {heightName && <input type="hidden" name={heightName} value={size.height ?? ""} />}

      <div className="mt-1 flex flex-wrap items-center gap-4">
        {url ? (
          <Image
            src={url}
            alt=""
            width={size.width ?? 320}
            height={size.height ?? 180}
            unoptimized
            className="h-24 w-auto max-w-56 rounded-md border border-gray-200 bg-white object-contain"
          />
        ) : (
          <div className="flex h-24 w-40 items-center justify-center rounded-md border border-dashed border-gray-300 text-xs text-gray-400">
            No image
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            id={inputId}
            type="file"
            accept={IMAGE_ACCEPT}
            className="sr-only"
            onChange={(event) => onFile(event.target.files?.[0])}
          />
          <label
            htmlFor={inputId}
            className={`${buttonClass} cursor-pointer border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 ${busy ? "pointer-events-none opacity-60" : ""}`}
          >
            {busy ? "Uploading…" : url ? "Replace" : "Upload"}
          </label>
          {url && !busy && (
            <button
              type="button"
              className={`${buttonClass} border border-gray-300 bg-white text-gray-800 hover:bg-gray-100`}
              onClick={() => {
                setUrl("");
                setSize({ width: null, height: null });
                markDirty();
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {hint && !message && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {message && <p className="mt-1 text-sm text-red-600">{message}</p>}
    </div>
  );
}
