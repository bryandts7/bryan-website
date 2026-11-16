"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

/** Seconds the post must be visible on screen before the view counts. */
const SECONDS_BEFORE_COUNTING = 5;
/** Crawlers, link-preview fetchers and automated browsers are not counted. */
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless|lighthouse|pingdom|monitor/i;

/** The visitor's local date as YYYY-MM-DD. */
function today(): string {
  return new Date().toLocaleDateString("en-CA");
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private mode or blocked storage: the view may be counted again tomorrow, which is fine.
  }
}

/**
 * Shows "· 1,234 views" in the post header and counts this visit: once per
 * browser per post per day, after the post has been visible for a few seconds,
 * never for bots. The site admin's own views are skipped by the database.
 * Shows nothing if the count can't be loaded.
 */
export default function PostViews({ postId, slug }: { postId: string; slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    let active = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    supabase
      .from("post_views")
      .select("views")
      .eq("post_id", postId)
      .maybeSingle<{ views: number }>()
      .then(({ data, error }) => {
        if (active && !error) setViews(data?.views ?? 0);
      });

    const storageKey = `post-viewed:${slug}`;
    const isBot = navigator.webdriver || BOT_PATTERN.test(navigator.userAgent);
    if (!isBot && readStorage(storageKey) !== today()) {
      let visibleSeconds = 0;
      timer = setInterval(() => {
        if (document.visibilityState !== "visible") return;
        visibleSeconds += 1;
        if (visibleSeconds < SECONDS_BEFORE_COUNTING) return;
        clearInterval(timer);
        supabase.rpc("record_post_view", { p_slug: slug }).then(({ data, error }) => {
          if (error) return; // Not remembered, so a later visit can try again.
          writeStorage(storageKey, today());
          if (active && typeof data === "number") setViews(data);
        });
      }, 1000);
    }

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [postId, slug]);

  if (views === null) return null;
  return (
    <>
      <span aria-hidden>·</span>
      <span>
        {views.toLocaleString("en-US")} view{views === 1 ? "" : "s"}
      </span>
    </>
  );
}
