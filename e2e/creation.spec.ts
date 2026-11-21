import { test, expect } from "@playwright/test";

test("créer un perso marseillais et reprendre sa vie", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByRole("link", { name: "Reprendre ma vie" })).toHaveCount(0);
  await page.getByRole("link", { name: "Joue ta vie" }).click();
  await expect(page).toHaveURL(/\/creer/);
  await page.getByLabel("Ton prénom").fill("Inès");
  await page.getByRole("button", { name: "Marseille" }).click();
  await expect(page.getByRole("button", { name: "Le Panier" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Paris 18e" })).toHaveCount(0);
  await page.getByRole("button", { name: "Noailles" }).click();
  await expect(page.getByRole("button", { name: "Noailles" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Peau foncée", exact: true }).click();
  await page.getByRole("button", { name: "Commencer ma vie à 18 ans" }).click();
  await expect(page).toHaveURL(/\/jouer/);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Reprendre ma vie" })).toBeVisible();
});

test("pas de défilement horizontal à 360 px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  for (const url of ["/", "/creer"]) {
    await page.goto(url);
    const largeur = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(largeur, url).toBeLessThanOrEqual(360);
  }
});
