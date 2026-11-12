import type { Metadata } from "next";
import Experiences from "@/components/experiences";
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
      <PageHeader title="Experience" intro="Where I've worked and studied." />
      <Experiences experiences={experiences} />
    </Container>
  );
}
