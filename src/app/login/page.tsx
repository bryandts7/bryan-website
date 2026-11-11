import type { Metadata } from "next";
import { Suspense } from "react";
import LoginButtons from "@/components/LoginButtons";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex grow items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-900">Sign in</h1>
        <p className="mt-2 mb-6 text-sm text-gray-600">
          Sign in to comment on posts. Only your name and profile picture are shown.
        </p>
        <Suspense fallback={<div className="h-28" />}>
          <LoginButtons />
        </Suspense>
      </div>
    </div>
  );
}
