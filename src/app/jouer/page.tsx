import type { Metadata } from "next";
import { Game } from "./Game";

export const metadata: Metadata = { title: "Ta vie · La Débrouille" };

export default function Jouer() {
  return <Game />;
}
