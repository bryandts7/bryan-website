import Image from "next/image";
import Link from "next/link";
import Notice, { StatusBadge } from "@/components/admin/Notice";
import { adminListProjects } from "@/lib/admin-data";
import { getAdminState } from "@/lib/auth";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  if ((await getAdminState()).status !== "admin") return null;
  const [projects, { deleted }] = await Promise.all([adminListProjects(), searchParams]);

  return (
    <div>
      {deleted && <Notice>Project deleted.</Notice>}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">Projects ({projects.length})</h2>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          New project
        </Link>
      </div>
      <p className="mb-3 text-sm text-gray-500">Shown on the site in this order (lowest number first).</p>

      <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {projects.map((project) => (
          <li key={project.id} className="flex items-center gap-4 px-4 py-3">
            <span className="w-8 text-right font-mono text-sm text-gray-400">{project.sort_order}</span>
            <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
              {project.image_url && (
                <Image src={project.image_url} alt="" fill sizes="64px" className="object-cover" />
              )}
            </div>
            <Link
              href={`/admin/projects/${project.id}`}
              className="min-w-0 grow font-medium text-blue-700 hover:underline"
            >
              {project.title}
            </Link>
            <StatusBadge status={project.status} />
          </li>
        ))}
        {projects.length === 0 && <li className="px-4 py-6 text-sm text-gray-500">No projects yet.</li>}
      </ul>
    </div>
  );
}
