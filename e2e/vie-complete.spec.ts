import { test, expect, type Page } from "@playwright/test";
import { creerVie } from "./helpers";

async function jouerUnPas(page: Page): Promise<boolean> {
  if (await page.getByRole("button", { name: "Rejouer une vie" }).isVisible()) return false;
  const bravo = page.getByRole("button", { name: "Trop bien" });
  if (await bravo.isVisible()) {
    await bravo.click();
    return true;
  }
  const vivre = page.getByRole("button", { name: "Vivre cette année" });
  if (await vivre.isVisible()) {
    const actions = page.locator(".action-btn");
    await actions.nth(0).click();
    await actions.nth(1).click();
    await vivre.click();
    return true;
  }
  const choix = page.getByTestId("choix").first();
  if (await choix.isVisible()) {
    await choix.click();
    return true;
  }
  const continuer = page.getByRole("button", { name: "Continuer" });
  if (await continuer.isVisible()) {
    await continuer.click();
    return true;
  }
  await page.waitForTimeout(50);
  return true;
}

test("une vie entière jusqu'à la carte de vie", async ({ page }) => {
  test.setTimeout(240_000);
  await creerVie(page, "e2e-vie");
  for (let i = 0; i < 1500 && (await jouerUnPas(page)); i++);
  await expect(page.getByRole("button", { name: "Rejouer une vie" })).toBeVisible();
  await expect(page.getByText("pts pour Paris")).toBeVisible();
  await expect(page.getByText(/^(Galérien|Débrouillard|Petit patron|Boss|Légende)$/)).toBeVisible();
  await page.getByRole("button", { name: "Rejouer une vie" }).click();
  await expect(page).toHaveURL(/\/creer/);
  expect(await page.evaluate(() => localStorage.getItem("debrouille.vie.v1"))).toBeNull();
});

test("recharger au milieu d'un événement garde le même événement", async ({ page }) => {
  await creerVie(page, "e2e-reload");
  await page.getByRole("button", { name: /Faire du sport/ }).click();
  await page.getByRole("button", { name: /Voir la famille/ }).click();
  await page.getByRole("button", { name: "Vivre cette année" }).click();
  const carte = page.locator(".event-card h2");
  await expect(carte).toBeVisible();
  const texte = await carte.textContent();
  await page.reload();
  await expect(page.locator(".event-card h2")).toHaveText(texte!);
});

test("une sauvegarde abîmée renvoie vers la création", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("debrouille.vie.v1", "{oups"));
  await page.goto("/jouer");
  await expect(page).toHaveURL(/\/creer/);
});
