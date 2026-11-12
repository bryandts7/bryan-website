import { SLUG_PATTERN } from "./slug";

/** What an admin Server Function returns to its form when it does not redirect. */
export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

/** Public URL prefix of the Supabase "media" bucket (the only allowed image host). */
export function mediaUrlPrefix(): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`;
}

/**
 * Reads and validates form fields, collecting one message per field.
 * Validation here is for friendly messages; the database checks again.
 */
export class FormReader {
  readonly fieldErrors: Record<string, string> = {};

  constructor(private readonly formData: FormData) {}

  get hasErrors(): boolean {
    return Object.keys(this.fieldErrors).length > 0;
  }

  state(): FormState {
    return { error: "Please fix the highlighted fields.", fieldErrors: this.fieldErrors };
  }

  private raw(name: string): string {
    const value = this.formData.get(name);
    return typeof value === "string" ? value : "";
  }

  private fail(name: string, message: string) {
    this.fieldErrors[name] ??= message;
  }

  text(name: string, { required = false, max = 1000, multiline = false } = {}): string {
    const raw = this.raw(name).replace(/\r\n/g, "\n");
    const value = multiline ? raw : raw.trim();
    if (required && !value.trim()) this.fail(name, "Required.");
    if (value.length > max) {
      this.fail(name, `Keep it under ${max.toLocaleString("en-US")} characters.`);
    }
    return value;
  }

  /** The row id for an edit, or null when creating. */
  optionalId(name = "id"): string | null {
    const value = this.raw(name).trim();
    if (!value) return null;
    if (!isUuid(value)) {
      this.fail(name, "Invalid id.");
      return null;
    }
    return value;
  }

  slug(name = "slug"): string {
    const value = this.raw(name).trim();
    if (!value) this.fail(name, "Required.");
    else if (!SLUG_PATTERN.test(value)) this.fail(name, "Use only letters, numbers, - and _.");
    else if (value.length > 100) this.fail(name, "Keep it under 100 characters.");
    return value;
  }

  /** "Python, LoRA, SFT" -> ["Python", "LoRA", "SFT"] */
  list(name: string, { maxItems = 20, maxLength = 50 } = {}): string[] {
    const items = [
      ...new Set(
        this.raw(name)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      ),
    ];
    if (items.length > maxItems) this.fail(name, `At most ${maxItems} items.`);
    if (items.some((item) => item.length > maxLength)) {
      this.fail(name, `Each item must be under ${maxLength} characters.`);
    }
    return items;
  }

  /** A full http(s) URL or a path on this site such as "/translator"; empty -> null. */
  link(name: string): string | null {
    const value = this.raw(name).trim();
    if (!value) return null;
    if (value.length > 2000) {
      this.fail(name, "That URL is too long.");
      return null;
    }
    if (value.startsWith("/") && !value.startsWith("//")) return value;
    try {
      const url = new URL(value);
      if (url.protocol === "http:" || url.protocol === "https:") return value;
    } catch {
      // fall through
    }
    this.fail(name, "Enter a full URL (https://…) or a path on this site (/translator).");
    return null;
  }

  /** An image uploaded to the media bucket; empty -> null. */
  imageUrl(name: string): string | null {
    const value = this.raw(name).trim();
    if (!value) return null;
    if (!value.startsWith(mediaUrlPrefix())) {
      this.fail(name, "Upload the image here instead of pasting a link.");
      return null;
    }
    return value;
  }

  /** A positive whole number, or null when empty. */
  optionalPositiveInt(name: string): number | null {
    const value = this.raw(name).trim();
    if (!value) return null;
    const number = Number(value);
    if (!Number.isInteger(number) || number <= 0 || number > 100_000) {
      this.fail(name, "Invalid number.");
      return null;
    }
    return number;
  }

  int(name: string, { min = -10_000, max = 10_000, fallback = 0 } = {}): number {
    const value = this.raw(name).trim();
    if (!value) return fallback;
    const number = Number(value);
    if (!Number.isInteger(number) || number < min || number > max) {
      this.fail(name, `Enter a whole number between ${min} and ${max}.`);
      return fallback;
    }
    return number;
  }

  oneOf<const T extends string>(name: string, options: readonly T[]): T {
    const value = this.raw(name);
    if ((options as readonly string[]).includes(value)) return value as T;
    this.fail(name, "Choose one of the options.");
    return options[0];
  }

  checkbox(name: string): boolean {
    return this.formData.get(name) === "on";
  }
}

/** Turns a database error into a message the admin can act on. */
export function dbErrorToState(
  error: { code?: string; message: string },
  noun: string
): FormState {
  switch (error.code) {
    case "23505": // unique_violation
      return {
        error: "Please fix the highlighted fields.",
        fieldErrors: { slug: `Another ${noun} already uses this slug.` },
      };
    case "42501": // insufficient_privilege / row-level security
      return { error: "You are not allowed to do this. Sign in again as the admin." };
    case "PGRST116": // .single() found no row
      return { error: `This ${noun} no longer exists. It may have been deleted.` };
    default:
      return { error: `Could not save the ${noun}: ${error.message}` };
  }
}
