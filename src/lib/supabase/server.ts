import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

/**
 * Supabase client that acts as the signed-in visitor (session read from
 * cookies). Every query runs under that user's database permissions.
 * Server only: Server Components, Server Functions and Route Handlers.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();
  const { url, key } = supabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Components cannot write cookies. Sessions for /admin are
          // refreshed in src/proxy.ts before the page renders.
        }
      },
    },
  });
}
