import ProjectForm from "@/components/admin/ProjectForm";
import ResetOnNavigate from "@/components/admin/ResetOnNavigate";
import { adminListProjects } from "@/lib/admin-data";
import { getAdminState } from "@/lib/auth";

export default async function NewProjectPage() {
  if ((await getAdminState()).status !== "admin") return null;

  // New projects go to the end of the list by default.
  const projects = await adminListProjects();
  const nextSortOrder = projects.reduce((max, p) => Math.max(max, p.sort_order), -1) + 1;

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-stone-900">New project</h2>
      <ResetOnNavigate>
        <ProjectForm nextSortOrder={nextSortOrder} />
      </ResetOnNavigate>
    </div>
  );
}
