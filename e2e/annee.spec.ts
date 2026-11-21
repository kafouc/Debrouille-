import { test, expect } from "@playwright/test";
import { creerVie, finirAnnee } from "./helpers";

test("vivre plusieurs années", async ({ page }) => {
  const erreurs: string[] = [];
  page.on("pageerror", (e) => erreurs.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") erreurs.push(m.text());
  });

  await creerVie(page, "e2e-1");
  await expect(page.getByText("Choisis 2 actions")).toBeVisible();
  await expect(page.getByText("0/2")).toBeVisible();
  const vivre = page.getByRole("button", { name: "Vivre cette année" });
  await expect(vivre).toBeDisabled();
  await page.getByRole("button", { name: /Faire du sport/ }).click();
  await page.getByRole("button", { name: /Voir la famille/ }).click();
  await expect(page.getByText("2/2")).toBeVisible();
  await expect(vivre).toBeEnabled();
  await vivre.click();

  const choix = page.getByTestId("choix");
  await expect(choix.first()).toBeVisible();
  expect(await choix.count()).toBeGreaterThanOrEqual(2);
  await choix.first().dblclick();
  await expect(page.getByRole("button", { name: "Continuer" })).toBeVisible();
  await finirAnnee(page);
  await expect(page.getByText("Choisis 2 actions")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("19 ans");

  for (let annee = 0; annee < 5; annee++) {
    await page.getByRole("button", { name: /Faire du sport/ }).click();
    await page.getByRole("button", { name: /Me reposer/ }).click();
    await page.getByRole("button", { name: "Vivre cette année" }).click();
    await finirAnnee(page);
  }
  await expect(page.getByRole("heading", { level: 1 })).toContainText("24 ans");
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
