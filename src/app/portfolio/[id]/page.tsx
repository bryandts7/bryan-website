import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import { articleProse } from "@/components/blog";
import { DocumentIcon, ExternalIcon, GitHubIcon } from "@/components/icons";
import MarkdownContent from "@/components/MarkdownContent";
import { buttonPrimary, buttonSecondary, Container, Tag } from "@/components/ui";
import { getProject, getProjects } from "@/lib/content";
import { OPEN_GRAPH_DEFAULTS } from "@/lib/site";

interface Props {
  params: Promise<{ id: string }>;
}

// Render the whole page ahead (or, for a project added after the build, in full
// before answering), so an unknown slug gets a real 404 instead of a page frame
// that is already on its way when notFound() runs.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ slug }) => ({ id: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/portfolio/${project.slug}` },
    // Page-level openGraph replaces the layout's, so the shared fields are repeated.
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      title: project.title,
      description: project.description,
      url: `/portfolio/${project.slug}`,
      images: project.image_url ? [project.image_url] : undefined,
    },
  };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const demoIsInternal = project.demo_url?.startsWith("/") ?? false;

  return (
    <Container size="narrow" className="pt-8">
      <BackLink href="/portfolio">All projects</BackLink>

      <header className="pt-8 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{project.title}</h1>
        {project.description && <p className="mt-3 text-lg text-muted">{project.description}</p>}
        {project.technologies.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {project.demo_url &&
            (demoIsInternal ? (
              <Link href={project.demo_url} className={buttonPrimary}>
                {project.is_interactive ? "Try it" : "Demo"}
              </Link>
            ) : (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                <ExternalIcon /> Demo
              </a>
            ))}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
              <GitHubIcon className="h-4 w-4" /> Code
            </a>
          )}
          {project.paper_url && (
            <a href={project.paper_url} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
              <DocumentIcon /> Paper
            </a>
          )}
        </div>
      </header>

      {project.image_url && (
        <div className="mb-10 overflow-hidden rounded-xl border border-line bg-surface">
          <Image
            src={project.image_url}
            alt={project.title}
            width={project.image_width ?? 1200}
            height={project.image_height ?? 675}
            priority
            sizes="(min-width: 768px) 720px, 100vw"
            className="mx-auto max-h-[28rem] w-full object-contain"
          />
        </div>
      )}

      {project.content_md.trim() && (
        <div className={articleProse}>
          <MarkdownContent>{project.content_md}</MarkdownContent>
        </div>
      )}
    </Container>
  );
}
