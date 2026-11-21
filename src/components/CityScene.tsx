import type { ReactNode } from "react";
import type { City } from "@/engine";

interface CitySceneProps {
  city: City;
  height?: number;
  children?: ReactNode;
}

function ParisDecor() {
  return (
    <svg viewBox="0 0 350 160" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
      <rect width="350" height="160" fill="#232C5A" />
      <circle cx="306" cy="30" r="13" fill="#FFE3A3" />
      <circle cx="40" cy="20" r="1.5" fill="#FFE3A3" />
      <circle cx="250" cy="14" r="1.5" fill="#FFE3A3" />
      <path d="M232 112 L246 22 L250 22 L264 112 Z" fill="#3A4680" />
      <rect x="238" y="64" width="20" height="3" fill="#3A4680" />
      <rect x="0" y="104" width="120" height="56" fill="#2E3870" />
      <path d="M0 104 L26 82 L94 82 L120 104 Z" fill="#5B6AA8" />
      <rect x="30" y="70" width="8" height="14" fill="#5B6AA8" />
      <rect x="14" y="116" width="10" height="14" rx="2" fill="#FFC93C" />
      <rect x="44" y="116" width="10" height="14" rx="2" fill="#3A4680" />
      <rect x="74" y="116" width="10" height="14" rx="2" fill="#FFC93C" />
      <rect x="230" y="112" width="120" height="48" fill="#283266" />
      <path d="M230 112 L252 94 L328 94 L350 112 Z" fill="#6474B4" />
      <rect x="250" y="124" width="10" height="14" rx="2" fill="#FFC93C" />
      <rect x="290" y="124" width="10" height="14" rx="2" fill="#FFC93C" />
    </svg>
  );
}

function MarseilleDecor() {
  return (
    <svg viewBox="0 0 350 160" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
      <rect width="350" height="160" fill="#8FD8F5" />
      <circle cx="300" cy="34" r="20" fill="#FFC93C" />
      <path d="M0 120 L36 84 L76 98 L112 70 L146 112 L350 112 L350 160 L0 160 Z" fill="#F2E6CF" />
      <path d="M76 98 L112 70 L124 86 L100 92 Z" fill="#E3CFA8" />
      <path d="M0 126 Q30 120 60 126 T120 126 T180 126 T240 126 T300 126 T350 126 L350 160 L0 160 Z" fill="#1679B5" />
      <path d="M296 120 L296 94 L314 118 Z" fill="#FFFFFF" />
      <path d="M286 122 L320 122 L314 129 L292 129 Z" fill="#FF5C8A" />
    </svg>
  );
}

/** Décor de la ville avec le personnage posé en bas. */
export function CityScene({ city, height = 160, children }: CitySceneProps) {
  return (
    <div style={{ position: "relative", height, borderRadius: 20, overflow: "hidden" }}>
      {city === "paris" ? <ParisDecor /> : <MarseilleDecor />}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 4, display: "flex", justifyContent: "center" }}>{children}</div>
    </div>
  );
}
