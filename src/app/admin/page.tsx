import Link from "next/link";
import { getAdminState } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

const sections = [
  { table: "posts", label: "Posts", href: "/admin/posts" },
  { table: "projects", label: "Projects", href: "/admin/projects" },
  { table: "experiences", label: "Experience entries", href: "/admin/experiences" },
  { table: "comments", label: "Comments", href: "/admin/comments" },
] as const;

export default async function AdminHomePage() {
  // Checked here as well as in the layout: a layout is not re-run on every navigation.
  if ((await getAdminState()).status !== "admin") return null;

  // Queries run as the signed-in admin, so drafts and hidden comments are counted too.
  const supabase = await createSessionClient();
  const counts = await Promise.all(
    sections.map(async ({ table }) => {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      return error ? null : count;
    })
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {sections.map(({ table, label, href }, index) => {
          const body = (
            <>
              <div className="text-3xl font-bold text-stone-900">{counts[index] ?? "–"}</div>
              <div className="mt-1 text-sm text-gray-600">{label}</div>
            </>
          );
          return href ? (
            <Link
              key={table}
              href={href}
              className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              {body}
            </Link>
          ) : (
            <div key={table} className="rounded-lg border border-gray-200 bg-white p-5">
              {body}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Write a new post
        </Link>
        <Link
          href="/admin/about"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
        >
          Edit About me
        </Link>
      </div>
    </div>
  );
}
