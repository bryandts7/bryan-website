import { ImageResponse } from "next/og";
import { formatDate, getPost } from "@/lib/content";
import { OG_SIZE, OgCard } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

// Link-preview image for each post: its title on a branded card.

export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  const footer = post
    ? [formatDate(post.published_at), `${post.reading_minutes} min read`].filter(Boolean).join(" · ")
    : SITE_NAME;

  return new ImageResponse(
    <OgCard eyebrow="Blog · Bryan Delton" title={post?.title ?? SITE_NAME} footer={footer} />,
    size
  );
}
