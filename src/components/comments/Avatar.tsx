import Image from "next/image";

// Profile pictures come from the sign-in provider. Only these hosts are
// allowed in next.config.ts; anything else falls back to initials.
const AVATAR_HOSTS = new Set(["avatars.githubusercontent.com", "lh3.googleusercontent.com"]);

function isAllowed(url: string | null): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && AVATAR_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

export default function Avatar({ name, url, size = 36 }: { name: string; url: string | null; size?: number }) {
  if (isAllowed(url)) {
    return (
      <Image
        src={url}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full bg-surface"
        style={{ width: size, height: size }}
      />
    );
  }

  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?";

  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-muted"
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}
