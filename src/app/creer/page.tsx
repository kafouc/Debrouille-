import type { Metadata } from "next";
import { CreationForm } from "@/components/CreationForm";

export const metadata: Metadata = { title: "Crée ton perso · La Débrouille" };

export default function Creer() {
  return <CreationForm />;
}
