import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { signOut } from "@/app/auth/actions";
import { getAdminState } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grow bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Suspense fallback={<p className="text-sm text-gray-500">Checking access…</p>}>
          <AdminGate>{children}</AdminGate>
        </Suspense>
      </div>
    </div>
  );
}

// The page inside is only rendered for admins. Each admin page and Server
// Function also checks the role itself, and the database enforces it again.
async function AdminGate({ children }: { children: ReactNode }) {
  const state = await getAdminState();

  if (state.status === "signed-out") {
    redirect("/login?next=/admin");
  }

  return (
    <>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-stone-900">Admin</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Signed in as {state.user.displayName}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-medium text-gray-800 transition-colors hover:bg-gray-100"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {state.status === "admin" ? (
        children
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <h2 className="font-semibold">This account is not an admin</h2>
          <p className="mt-1 text-sm">
            You are signed in, but only the site owner can open the admin console.
          </p>
        </div>
      )}
    </>
  );
}
