import type { Metadata } from "next";
import Experiences from "@/components/experiences";
import { getExperiences } from "@/lib/content";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Industry and academic experience of Bryan Delton Tawarikh Sibarani.",
};

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  return <Experiences experiences={experiences} />;
}
