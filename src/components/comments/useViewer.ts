"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export interface Viewer {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  isAdmin: boolean;
}

/**
 * The signed-in visitor, read in the browser so the post page itself can stay
 * fully static. `undefined` while loading, `null` when signed out.
 *
 * This only decides what the comment UI shows. Every comment action checks the
 * caller again on the server, and the database checks a third time.
 */
export function useViewer(): Viewer | null | undefined {
  const [viewer, setViewer] = useState<Viewer | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    let active = true;

    async function load() {
      const { data, error } = await supabase.auth.getClaims();
      const userId = data?.claims?.sub;
      if (error || !userId) {
        if (active) setViewer(null);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, role")
        .eq("id", userId)
        .maybeSingle<{ display_name: string; avatar_url: string | null; role: string }>();
      if (!active) return;
      setViewer(
        profile
          ? {
              id: userId,
              displayName: profile.display_name,
              avatarUrl: profile.avatar_url,
              isAdmin: profile.role === "admin",
            }
          : null,
      );
    }

    void load();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") setViewer(null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return viewer;
}
