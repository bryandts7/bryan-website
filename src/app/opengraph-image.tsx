import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

// Default link-preview image for pages without their own.

export const alt = SITE_NAME;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="Data science · Machine learning · Quant"
      title={SITE_NAME}
      footer="Projects, experience and blog"
    />,
    size
  );
}
