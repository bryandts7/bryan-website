import Link from "next/link";
import Notice from "@/components/admin/Notice";
import { adminListExperiences } from "@/lib/admin-data";
import { getAdminState } from "@/lib/auth";

const sections = [
  { kind: "work", heading: "Industry experience" },
  { kind: "academic", heading: "Academia experience" },
] as const;

export default async function AdminExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  if ((await getAdminState()).status !== "admin") return null;
  const [entries, { deleted }] = await Promise.all([adminListExperiences(), searchParams]);

  return (
    <div className="space-y-8">
      {deleted && <Notice>Entry deleted.</Notice>}
      {sections.map(({ kind, heading }) => {
        const items = entries.filter((entry) => entry.kind === kind);
        return (
          <section key={kind}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900">
                {heading} ({items.length})
              </h2>
              <Link
                href={`/admin/experiences/new?kind=${kind}`}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
              >
                Add entry
              </Link>
            </div>
            <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
              {items.map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                  <span className="w-8 text-right font-mono text-sm text-gray-400">{entry.sort_order}</span>
                  <Link
                    href={`/admin/experiences/${entry.id}`}
                    className="min-w-0 grow font-medium text-blue-700 hover:underline"
                  >
                    {entry.title}
                    <span className="font-normal text-gray-500"> · {entry.organization}</span>
                  </Link>
                  <span className="text-sm text-gray-500">{entry.period}</span>
                </li>
              ))}
              {items.length === 0 && <li className="px-4 py-6 text-sm text-gray-500">No entries yet.</li>}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
