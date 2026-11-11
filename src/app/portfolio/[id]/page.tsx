import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import MarkdownContent from "@/components/MarkdownContent";
import Title from "@/components/title";
import { getProject, getProjects } from "@/lib/content";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ slug }) => ({ id: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="grow bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div>
          <BackLink href="/portfolio">Back to Projects</BackLink>
        </div>

        <Title>{project.title}</Title>

        {/* Image Container with constrained size */}
        {project.image_url && (
          <div className="relative w-full max-w-4xl mx-auto mb-8">
            <Image
              src={project.image_url}
              alt={project.title}
              width={project.image_width ?? 1200}
              height={project.image_height ?? 675}
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-contain w-full h-full max-h-96 rounded-lg"
            />
          </div>
        )}

        {/* Technologies Used */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Project Content */}
        <div className="prose prose-lg max-w-none mb-8 text-gray-700">
          <MarkdownContent>{project.content_md}</MarkdownContent>
        </div>

        {/* Links Section */}
        <div className="flex gap-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              GitHub →
            </a>
          )}
          {project.paper_url && (
            <a
              href={project.paper_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Paper →
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Demo →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
