import { test, expect } from "@playwright/test";
import { creerVie, finirAnnee } from "./helpers";

test("vivre plusieurs années, avec la scène et le bilan", async ({ page }) => {
  const erreurs: string[] = [];
  page.on("pageerror", (e) => erreurs.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") erreurs.push(m.text());
  });

  await creerVie(page, "e2e-1");
  await expect(page.getByText("0/2")).toBeVisible();
  const vivre = page.getByRole("button", { name: "Vivre cette année" });
  await expect(vivre).toBeDisabled();
  await page.getByRole("button", { name: /Faire du sport/ }).click();
  await page.getByRole("button", { name: /Voir la famille/ }).click();
  await expect(page.getByText("2/2")).toBeVisible();
  await vivre.click();

  await expect(page.getByText("Action 1/2")).toBeVisible();
  await page.getByRole("button", { name: "Action suivante" }).click();
  await expect(page.getByText("Action 2/2")).toBeVisible();
  await page.getByRole("button", { name: "Continuer" }).dblclick();

  for (let i = 0; i < 20 && !(await page.getByText("Joyeux anniversaire").isVisible()); i++) {
    const choix = page.getByTestId("choix").first();
    if (await choix.isVisible()) await choix.click();
    const cont = page.getByRole("button", { name: "Continuer" });
    if (await cont.isVisible()) await cont.click();
    const passer = page.getByRole("button", { name: "Passer", exact: true });
    if (await passer.isVisible()) await passer.click();
  }
  await expect(page.getByText("Joyeux anniversaire, Inès !")).toBeVisible();
  await expect(page.getByText("Tu as maintenant 19 ans.")).toBeVisible();
  await expect(page.getByText("Total de l'année")).toBeVisible();
  await page.getByRole("button", { name: "Année suivante" }).click();
  await expect(page.getByText("Choisis 2 actions")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("19 ans");

  for (let annee = 0; annee < 4; annee++) {
    await page.getByRole("button", { name: /Faire du sport/ }).click();
    await page.getByRole("button", { name: /Me reposer/ }).click();
    await page.getByRole("button", { name: "Vivre cette année" }).click();
    await finirAnnee(page);
  }
  await expect(page.getByRole("heading", { level: 1 })).toContainText("23 ans");
  expect(erreurs).toEqual([]);
});

test("une troisième action remplace la plus ancienne", async ({ page }) => {
  await creerVie(page, "e2e-2");
  const sport = page.getByRole("button", { name: /Faire du sport/ });
  const famille = page.getByRole("button", { name: /Voir la famille/ });
  const repos = page.getByRole("button", { name: /Me reposer/ });
  await sport.click();
  await famille.click();
  await repos.click();
  await expect(sport).toHaveAttribute("aria-pressed", "false");
  await expect(famille).toHaveAttribute("aria-pressed", "true");
  await expect(repos).toHaveAttribute("aria-pressed", "true");
});

test("sans vie sauvegardée, /jouer renvoie vers la création", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/jouer");
  await expect(page).toHaveURL(/\/creer/);
});

test("une nouvelle vie commence par le départ du nid", async ({ page }) => {
  await creerVie(page, "e2e-depart", "Paris", true);
  await expect(page.getByRole("dialog", { name: "Le départ du nid" })).toBeVisible();
  await page.getByRole("button", { name: "Passer", exact: true }).click();
  await expect(page.getByText("Choisis 2 actions")).toBeVisible();
});

test("la pêche : on peut la passer et la vie continue", async ({ page }) => {
  await creerVie(page, "peche-1");
  await page.getByRole("button", { name: /Sortir/ }).click();
  await page.getByRole("button", { name: /Me reposer/ }).click();
  await page.getByRole("button", { name: "Vivre cette année" }).click();
  await page.getByRole("button", { name: "Action suivante" }).click();
  await page.getByRole("button", { name: "Continuer" }).click();
  await expect(page.getByRole("heading", { name: "La pêche" })).toBeVisible();
  await page.getByRole("button", { name: "Jouer" }).click();
  await expect(page.getByRole("button", { name: "Ferrer !" })).toBeVisible();
  await page.getByRole("button", { name: "Passer le mini-jeu" }).click();
  await expect(page.getByRole("heading", { name: "La pêche" })).toHaveCount(0);
});
