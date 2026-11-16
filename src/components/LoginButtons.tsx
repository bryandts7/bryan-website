"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { safeNextPath } from "@/lib/safe-path";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { T } from "./Lang";
import type { MessageKey } from "@/lib/i18n";

type Provider = "github" | "google";

const providers: { id: Provider; label: MessageKey }[] = [
  { id: "github", label: "login.github" },
  { id: "google", label: "login.google" },
];

export default function LoginButtons() {
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<Provider | null>(null);
  // "callback" = the sign-in round trip failed; any other text is the provider's own error.
  const [error, setError] = useState<string | null>(searchParams.get("error") ? "callback" : null);

  async function signIn(provider: Provider) {
    setPending(provider);
    setError(null);

    const next = safeNextPath(searchParams.get("next"));
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await createBrowserSupabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    // On success the browser leaves for the provider; we only get here on failure.
    if (error) {
      setError(error.message);
      setPending(null);
    }
  }

  return (
    <div className="space-y-3">
      {providers.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => signIn(id)}
          disabled={pending !== null}
          className="w-full rounded-lg border border-line bg-card px-4 py-3 font-medium text-ink transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
        >
          <T k={pending === id ? "login.redirecting" : label} />
        </button>
      ))}
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error === "callback" ? <T k="login.error" /> : error}
        </p>
      )}
    </div>
  );
}
