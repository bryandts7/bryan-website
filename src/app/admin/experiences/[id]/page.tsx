import { notFound } from "next/navigation";
import ResetOnNavigate from "@/components/admin/ResetOnNavigate";
import ExperienceForm from "@/components/admin/ExperienceForm";
import Notice from "@/components/admin/Notice";
import { adminGetExperience } from "@/lib/admin-data";
import { getAdminState } from "@/lib/auth";

export default async function EditExperiencePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  if ((await getAdminState()).status !== "admin") return null;
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const experience = await adminGetExperience(id);
  if (!experience) notFound();

  return (
    <div>
      {saved && <Notice>Saved.</Notice>}
      <h2 className="mb-6 text-lg font-semibold text-stone-900">Edit experience entry</h2>
      <ResetOnNavigate>
        <ExperienceForm key={experience.updated_at} experience={experience} />
      </ResetOnNavigate>
    </div>
  );
}
