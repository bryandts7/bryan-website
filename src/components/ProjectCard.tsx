import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";
import { DocumentIcon, ExternalIcon, GitHubIcon } from "./icons";
import { Tag } from "./ui";

const MAX_TAGS = 4;

/**
 * One project in a grid. The title link covers the whole card; the GitHub,
 * paper and demo links sit above it so they stay clickable.
 */
export default function ProjectCard({ project, headingLevel = "h2" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const extraTags = project.technologies.length - MAX_TAGS;
  const demoIsInternal = project.demo_url?.startsWith("/") ?? false;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-card transition-colors hover:border-subtle">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {project.image_url && (
          <Image
            src={project.image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
        {project.is_interactive && (
          <span className="absolute top-3 right-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
            Interactive
          </span>
        )}
      </div>

      <div className="flex grow flex-col p-5">
        <Heading className="text-lg font-semibold leading-snug text-ink group-hover:text-accent">
          <Link href={`/portfolio/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </Heading>
        {project.description && <p className="mt-2 line-clamp-3 text-sm text-muted">{project.description}</p>}

        {project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, MAX_TAGS).map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
            {extraTags > 0 && <Tag>+{extraTags}</Tag>}
          </div>
        )}

        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-4 pt-5 text-sm font-medium">
          {project.is_interactive && project.demo_url && (
            <Link href={project.demo_url} className="text-emerald-600 hover:underline dark:text-emerald-400">
              Try it →
            </Link>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-ink">
              <GitHubIcon className="h-4 w-4" /> Code
            </a>
          )}
          {project.paper_url && (
            <a href={project.paper_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-ink">
              <DocumentIcon /> Paper
            </a>
          )}
          {!project.is_interactive && project.demo_url && (
            <a
              href={project.demo_url}
              {...(demoIsInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex items-center gap-1.5 text-muted hover:text-ink"
            >
              <ExternalIcon /> Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
