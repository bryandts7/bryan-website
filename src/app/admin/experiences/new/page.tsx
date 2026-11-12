import ExperienceForm from "@/components/admin/ExperienceForm";
import ResetOnNavigate from "@/components/admin/ResetOnNavigate";
import { getAdminState } from "@/lib/auth";

export default async function NewExperiencePage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  if ((await getAdminState()).status !== "admin") return null;
  const { kind } = await searchParams;

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-stone-900">New experience entry</h2>
      <ResetOnNavigate>
        <ExperienceForm defaultKind={kind === "academic" ? "academic" : "work"} />
      </ResetOnNavigate>
    </div>
  );
}
