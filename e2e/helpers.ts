import { expect, type Page } from "@playwright/test";

/** Crée une vie avec une graine fixe et arrive sur l'écran de jeu (cinématique de départ passée, sauf demande contraire). */
export async function creerVie(page: Page, seed: string, ville: "Paris" | "Marseille" = "Paris", garderCinematique = false) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.goto(`/creer?seed=${seed}`);
  await page.getByLabel("Ton prénom").fill("Inès");
  if (ville === "Marseille") await page.getByRole("button", { name: "Marseille" }).click();
  await page.getByRole("button", { name: "Commencer ma vie à 18 ans" }).click();
  await expect(page).toHaveURL(/\/jouer/);
  if (!garderCinematique) {
    await page.getByRole("button", { name: "Passer" }).click();
    await expect(page.getByText("Choisis 2 actions")).toBeVisible();
  }
}

/** Avance d'un pas dans la partie, quel que soit l'écran. Renvoie false quand la carte de vie est affichée. */
export async function avancer(page: Page, actions?: [RegExp, RegExp]): Promise<boolean> {
  if (await page.getByRole("button", { name: "Rejouer une vie" }).isVisible()) return false;
  const passer = page.getByRole("button", { name: "Passer", exact: true });
  if (await passer.isVisible()) {
    await passer.click();
    return true;
  }
  const vivre = page.getByRole("button", { name: "Vivre cette année" });
  if (await vivre.isVisible()) {
    if (actions) {
      await page.getByRole("button", { name: actions[0] }).click();
      await page.getByRole("button", { name: actions[1] }).click();
    } else {
      const boutons = page.locator(".action-btn");
      await boutons.nth(0).click();
      await boutons.nth(1).click();
    }
    await vivre.click();
    return true;
  }
  for (const nom of ["Continuer", "Action suivante", "Année suivante", "Passer le mini-jeu"]) {
    const b = page.getByRole("button", { name: nom, exact: true });
    if ((await b.isVisible()) && (await b.isEnabled())) {
      await b.click();
      return true;
    }
  }
  const choix = page.getByTestId("choix").first();
  if (await choix.isVisible()) {
    await choix.click();
    return true;
  }
  await page.waitForTimeout(50);
  return true;
}

/** Termine l'année en cours et revient à l'écran des actions. */
export async function finirAnnee(page: Page) {
  for (let i = 0; i < 40; i++) {
    if (await page.getByRole("button", { name: "Vivre cette année" }).isVisible()) return;
    await avancer(page);
  }
}
