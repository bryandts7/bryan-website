import type { Metadata } from "next";
import Experiences from "@/components/experiences";
import { T } from "@/components/Lang";
import { Container, PageHeader } from "@/components/ui";
import { getExperiences } from "@/lib/content";

export const metadata: Metadata = {
  title: "Experience",
  description: "Industry and academic experience of Bryan Delton Tawarikh Sibarani.",
  alternates: { canonical: "/experiences" },
};

export default async function ExperiencesPage() {
  const experiences = await getExperiences();

  return (
    <Container>
      <PageHeader title={<T k="experience.title" />} intro={<T k="experience.intro" />} />
      <Experiences experiences={experiences} />
    </Container>
  );
}
