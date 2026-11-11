import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import Title from "@/components/title";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of my Data Science, Software Engineering, and Quant projects.",
};

export default function PortfolioPage() {
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
