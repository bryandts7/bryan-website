import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blogs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/portfolio`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/experiences`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/translator`, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...pages,
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updated_at,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/portfolio/${project.slug}`,
      lastModified: project.updated_at,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
