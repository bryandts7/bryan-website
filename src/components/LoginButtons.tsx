"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { safeNextPath } from "@/lib/safe-path";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Provider = "github" | "google";

const providers: { id: Provider; label: string }[] = [
  { id: "github", label: "Continue with GitHub" },
  { id: "google", label: "Continue with Google" },
];

export default function LoginButtons() {
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? "Sign-in did not complete. Please try again." : null
  );

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
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending === id ? "Redirecting…" : label}
        </button>
      ))}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
