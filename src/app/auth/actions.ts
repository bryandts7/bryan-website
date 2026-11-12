"use server";

import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/safe-path";
import { createSessionClient } from "@/lib/supabase/server";

/** Signs out, then returns to `next` (a path on this site) or the home page. */
export async function signOut(formData?: FormData) {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  const next = formData?.get("next");
  redirect(safeNextPath(typeof next === "string" ? next : null));
}
