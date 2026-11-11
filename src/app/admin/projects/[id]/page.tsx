import { notFound } from "next/navigation";
import ResetOnNavigate from "@/components/admin/ResetOnNavigate";
import Notice from "@/components/admin/Notice";
import ProjectForm from "@/components/admin/ProjectForm";
import { adminGetProject } from "@/lib/admin-data";
import { getAdminState } from "@/lib/auth";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  if ((await getAdminState()).status !== "admin") return null;
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const project = await adminGetProject(id);
  if (!project) notFound();

  return (
    <div>
      {saved && <Notice>Saved.</Notice>}
      <h2 className="mb-6 text-lg font-semibold text-stone-900">Edit project</h2>
      <ResetOnNavigate>
        <ProjectForm key={project.updated_at} project={project} />
      </ResetOnNavigate>
    </div>
  );
}
