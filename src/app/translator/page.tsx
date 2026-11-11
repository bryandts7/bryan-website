import type { Metadata } from "next";
import BahasaUnangTranslator from "@/components/BahasaUnangTranslator";

export const metadata: Metadata = {
  title: "Bahasa Unang Translator",
  description: "Translate between Indonesian and Bahasa Unang.",
};

export default function TranslatorPage() {
  return <BahasaUnangTranslator />;
}
