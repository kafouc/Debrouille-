import { test, expect } from "@playwright/test";
import { avancer, creerVie } from "./helpers";

test("une vie entière jusqu'à la carte de vie", async ({ page }) => {
  test.setTimeout(300_000);
  await creerVie(page, "e2e-vie");
  let vuDefile = false;
  for (let i = 0; i < 3000; i++) {
    if (await page.getByRole("dialog", { name: "Ta vie défile" }).isVisible()) vuDefile = true;
    if (!(await avancer(page))) break;
  }
  expect(vuDefile).toBe(true);
  await expect(page.getByRole("button", { name: "Rejouer une vie" })).toBeVisible();
  await expect(page.getByText("pts pour Paris")).toBeVisible();
  await page.getByRole("button", { name: "Rejouer une vie" }).click();
  await expect(page).toHaveURL(/\/creer/);
  expect(await page.evaluate(() => localStorage.getItem("debrouille.vie.v1"))).toBeNull();
});

test("recharger pendant la scène, un événement ou le bilan retrouve le même écran", async ({ page }) => {
  await creerVie(page, "e2e-reload");
  await page.getByRole("button", { name: /Faire du sport/ }).click();
  await page.getByRole("button", { name: /Voir la famille/ }).click();
  await page.getByRole("button", { name: "Vivre cette année" }).click();
  await expect(page.getByText("Action 1/2")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Ton année en scène")).toBeVisible();
  await page.getByRole("button", { name: "Action suivante" }).click();
  await page.getByRole("button", { name: "Continuer" }).click();
  const carte = page.locator(".event-card h2");
  if (await carte.isVisible()) {
    const texte = await carte.textContent();
    await page.reload();
    await expect(page.locator(".event-card h2")).toHaveText(texte!);
  }
  for (let i = 0; i < 20 && !(await page.getByText("Total de l'année").isVisible()); i++) await avancer(page);
  await page.reload();
  await expect(page.getByText("Total de l'année")).toBeVisible();
});

test("une sauvegarde abîmée renvoie vers la création", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("debrouille.vie.v1", "{oups"));
  await page.goto("/jouer");
  await expect(page).toHaveURL(/\/creer/);
});
