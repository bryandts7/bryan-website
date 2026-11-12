import type { Project } from "@/lib/content";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid({
  projects,
  headingLevel = "h2",
}: {
  projects: Project[];
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} headingLevel={headingLevel} />
      ))}
    </div>
  );
}
