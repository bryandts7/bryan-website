import type { Metadata } from "next";
import { T } from "@/components/Lang";
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
  const work = projects.filter((project) => project.kind === "work");
  const personal = projects.filter((project) => project.kind !== "work");

  return (
    <Container>
      <PageHeader
        title={<T k="projects.title" />}
        intro={<T k="projects.intro" />}
      />
      {work.length > 0 && (
        <section aria-labelledby="work-projects" className="mb-14">
          <h2 id="work-projects" className="text-2xl font-bold tracking-tight text-ink">
            <T k="projects.work" />
          </h2>
          <p className="mt-2 mb-6 max-w-2xl text-muted">
            <T k="projects.workIntro" />
          </p>
          <ProjectGrid projects={work} headingLevel="h3" />
        </section>
      )}
      <section aria-labelledby={work.length > 0 ? "personal-projects" : undefined}>
        {work.length > 0 && (
          <h2 id="personal-projects" className="mb-6 text-2xl font-bold tracking-tight text-ink">
            <T k="projects.personal" />
          </h2>
        )}
        <ProjectGrid projects={personal} headingLevel={work.length > 0 ? "h3" : "h2"} />
      </section>
    </Container>
  );
}
