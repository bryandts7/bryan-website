import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/safe-path";
import { createSessionClient } from "@/lib/supabase/server";

// GitHub/Google send the visitor back here with a one-time code, which is
// exchanged for a session cookie.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  // Behind Netlify's proxy the public host and scheme arrive in forwarded headers.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const base = forwardedHost ? `${forwardedProto ?? "https"}://${forwardedHost}` : origin;

  if (code) {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, base));
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth", base));
}
