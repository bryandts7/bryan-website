import type { Project } from "@/lib/content";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.slug}
            title={project.title}
            description={project.description}
            imageUrl={project.image_url}
            technologies={project.technologies}
            githubUrl={project.github_url}
            paperUrl={project.paper_url}
            demoUrl={project.demo_url}
            isInteractive={project.is_interactive}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectGrid;
