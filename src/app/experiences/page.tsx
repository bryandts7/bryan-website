import type { Metadata } from "next";
import Experiences from "@/components/experiences";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Industry and academic experience of Bryan Delton Tawarikh Sibarani.",
};

export default function ExperiencesPage() {
  return <Experiences />;
}
