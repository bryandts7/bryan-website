import { slugify } from "./slug";
import { createBrowserSupabase } from "./supabase/browser";

// Browser-side upload to the Supabase "media" bucket. The upload runs as the
// signed-in user; the bucket's policies only accept it from an admin.

const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 5 * 1024 * 1024; // same limit as the bucket

export type MediaFolder = "posts" | "projects" | "logos";

export interface UploadedImage {
  url: string;
  width: number | null;
  height: number | null;
}

export async function uploadImage(file: File, folder: MediaFolder): Promise<UploadedImage> {
  const extension = TYPES[file.type];
  if (!extension) throw new Error("Use a PNG, JPEG, WebP or GIF image.");
  if (file.size > MAX_BYTES) throw new Error("Images must be 5 MB or smaller.");

  let width: number | null = null;
  let height: number | null = null;
  try {
    const bitmap = await createImageBitmap(file);
    width = bitmap.width;
    height = bitmap.height;
    bitmap.close();
  } catch {
    // Dimensions are optional; the page falls back to a default aspect ratio.
  }

  const base = slugify(file.name.replace(/\.[^.]+$/, ""), 40) || "image";
  const path = `${folder}/${Date.now()}-${base}.${extension}`;

  const supabase = createBrowserSupabase();
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl, width, height };
}

export const IMAGE_ACCEPT = Object.keys(TYPES).join(",");
