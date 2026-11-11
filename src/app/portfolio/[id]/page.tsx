import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Title from "@/components/title";
import { projects } from "@/data/projects";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return projects.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <div className="grow bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div>
          <BackLink href="/portfolio">Back to Projects</BackLink>
        </div>

        <Title>{project.title}</Title>

        {/* Image Container with constrained size */}
        <div className="relative w-full max-w-4xl mx-auto mb-8">
          <Image
            src={project.imageUrl}
            alt={project.title}
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-contain w-full h-full max-h-96 rounded-lg"
          />
        </div>

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
        <div className="max-w-none mb-8">
          <p className="text-lg text-gray-700">{project.content}</p>
        </div>

        {/* Links Section */}
        <div className="flex gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              GitHub →
            </a>
          )}
          {project.paperUrl && (
            <a
              href={project.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Paper →
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
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
