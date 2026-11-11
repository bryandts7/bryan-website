import Link from "next/link";
import { getAdminState } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

const tables = [
  { table: "posts", label: "Posts", href: "/blogs" },
  { table: "projects", label: "Projects", href: "/portfolio" },
  { table: "experiences", label: "Experience entries", href: "/experiences" },
  { table: "comments", label: "Comments", href: null },
] as const;

export default async function AdminHomePage() {
  // Checked here as well as in the layout: a layout is not re-run on every navigation.
  const state = await getAdminState();
  if (state.status !== "admin") return null;

  // Queries run as the signed-in admin, so drafts and hidden comments are counted too.
  const supabase = await createSessionClient();
  const counts = await Promise.all(
    tables.map(async ({ table }) => {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      return error ? null : count;
    })
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {tables.map(({ table, label, href }, index) => (
          <div key={table} className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="text-3xl font-bold text-stone-900">{counts[index] ?? "–"}</div>
            <div className="mt-1 text-sm text-gray-600">{label}</div>
            {href && (
              <Link href={href} className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                View on site
              </Link>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        Editing posts, projects, experience and the About-me text arrives in the next phase.
      </p>
    </div>
  );
}
