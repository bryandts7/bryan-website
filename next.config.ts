import type { NextConfig } from "next";
import { EXTERNAL_IMAGE_SOURCES } from "./src/lib/external-images";

// Images uploaded through the admin console live in the Supabase "media" bucket.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      ...(supabaseUrl ? [new URL("/storage/v1/object/public/media/**", supabaseUrl)] : []),
      // Commenters' profile pictures from GitHub and Google sign-in. Written as
      // objects (not URLs) so query strings such as GitHub's "?v=4" are allowed.
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      // Preview images of work projects, from the employer's public website.
      ...EXTERNAL_IMAGE_SOURCES.map(({ hostname, pathPrefix }) => ({
        protocol: "https" as const,
        hostname,
        pathname: `${pathPrefix}**`,
      })),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
