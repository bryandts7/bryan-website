import { notFound } from "next/navigation";
import ResetOnNavigate from "@/components/admin/ResetOnNavigate";
import Notice from "@/components/admin/Notice";
import PostForm from "@/components/admin/PostForm";
import { adminGetPost } from "@/lib/admin-data";
import { getAdminState } from "@/lib/auth";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  if ((await getAdminState()).status !== "admin") return null;
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const post = await adminGetPost(id);
  if (!post) notFound();

  return (
    <div>
      {saved && <Notice>Saved. {post.status === "published" ? "The post is live." : "The post is a draft."}</Notice>}
      <h2 className="mb-6 text-lg font-semibold text-stone-900">Edit post</h2>
      {/* The key remounts the form after a save, so it starts clean from the saved data. */}
      <ResetOnNavigate>
        <PostForm key={post.updated_at} post={post} />
      </ResetOnNavigate>
    </div>
  );
}
