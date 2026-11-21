import { expect, type Page } from "@playwright/test";

/** Crée une vie avec une graine fixe et arrive sur l'écran de jeu. */
export async function creerVie(page: Page, seed: string, ville: "Paris" | "Marseille" = "Paris") {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.goto(`/creer?seed=${seed}`);
  await page.getByLabel("Ton prénom").fill("Inès");
  if (ville === "Marseille") await page.getByRole("button", { name: "Marseille" }).click();
  await page.getByRole("button", { name: "Commencer ma vie à 18 ans" }).click();
  await expect(page).toHaveURL(/\/jouer/);
}

/** Termine l'année en cours : choisit le premier choix puis « Continuer » jusqu'au retour aux actions. */
export async function finirAnnee(page: Page) {
  for (let i = 0; i < 10; i++) {
    if (await page.getByText("Choisis 2 actions").isVisible()) return;
    const choix = page.getByTestId("choix").first();
    if (await choix.isVisible()) {
      await choix.click();
      continue;
    }
    const continuer = page.getByRole("button", { name: "Continuer" });
    if (await continuer.isVisible()) {
      await continuer.click();
      continue;
    }
    await page.waitForTimeout(100);
  }
}
