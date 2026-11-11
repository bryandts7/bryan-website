import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import { Container, PageHeader } from "@/components/ui";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Data science, machine learning, software engineering and quant projects.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <Container>
      <PageHeader
        title="Projects"
        intro="Data science, machine learning, software engineering and quant projects."
      />
      <ProjectGrid projects={projects} />
    </Container>
  );
}
