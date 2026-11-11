import AboutForm from "@/components/admin/AboutForm";
import ResetOnNavigate from "@/components/admin/ResetOnNavigate";
import Notice from "@/components/admin/Notice";
import { adminGetAbout } from "@/lib/admin-data";
import { getAdminState } from "@/lib/auth";

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  if ((await getAdminState()).status !== "admin") return null;
  const [about, { saved }] = await Promise.all([adminGetAbout(), searchParams]);

  return (
    <div>
      {saved && <Notice>Saved. The home page shows the new text.</Notice>}
      <ResetOnNavigate>
        <AboutForm key={about.updated_at ?? "new"} value={about.value_md} />
      </ResetOnNavigate>
    </div>
  );
}
