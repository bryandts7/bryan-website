import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import Title from "@/components/title";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of my Data Science, Software Engineering, and Quant projects.",
};

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="grow bg-gray-50">
      <div className="text-center py-12">
        <Title>My Projects</Title>
        <p className="text-xl text-gray-600 mt-4">
          A collection of my Data Science, Software Engineering, and Quant projects
        </p>
      </div>
      <ProjectGrid projects={projects} />
    </div>
  );
}
