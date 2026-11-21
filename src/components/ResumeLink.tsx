"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadLife } from "@/lib/save";

/** « Reprendre ma vie », seulement s'il y a une vie en cours dans le téléphone. */
export function ResumeLink() {
  const [canResume, setCanResume] = useState(false);
  useEffect(() => {
    const life = loadLife();
    // Lecture du stockage local : uniquement côté navigateur, après le premier rendu.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanResume(!!life && life.phase !== "dead");
  }, []);
  if (!canResume) return null;
  return (
    <Link href="/jouer" className="btn-secondary">
      Reprendre ma vie
    </Link>
  );
}
