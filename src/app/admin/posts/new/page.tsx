import PostForm from "@/components/admin/PostForm";
import ResetOnNavigate from "@/components/admin/ResetOnNavigate";
import { getAdminState } from "@/lib/auth";

export default async function NewPostPage() {
  if ((await getAdminState()).status !== "admin") return null;

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-stone-900">New post</h2>
      <ResetOnNavigate>
        <PostForm />
      </ResetOnNavigate>
    </div>
  );
}
