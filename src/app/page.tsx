import Link from "next/link";
import { HomeIllustration } from "@/components/HomeIllustration";
import { ResumeLink } from "@/components/ResumeLink";

export default function Accueil() {
  return (
    <main className="screen" style={{ paddingTop: 40, gap: 20 }}>
      <div className="stack" style={{ alignItems: "center", textAlign: "center" }}>
        <h1 className="title-xl">La Débrouille</h1>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Pars de rien. Deviens une légende.</p>
      </div>
      <HomeIllustration />
      <p className="muted" style={{ margin: 0, textAlign: "center", fontWeight: 700 }}>
        Paris ou Marseille : choisis ton camp, vis ta vie, et fais gagner ta ville.
      </p>
      <div className="grow" />
      <div className="stack" style={{ gap: 10 }}>
        <Link href="/creer" className="btn-primary" style={{ minHeight: 60, fontSize: 22 }}>
          Joue ta vie
        </Link>
        <ResumeLink />
        <p className="muted small" style={{ margin: 0, textAlign: "center" }}>
          Gratuit · sans inscription · une vie = 10 min
        </p>
      </div>
    </main>
  );
}
