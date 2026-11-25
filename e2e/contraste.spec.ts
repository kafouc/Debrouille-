import { test, expect, type Locator } from "@playwright/test";
import { creerVie } from "./helpers";

/** Rapport de contraste WCAG entre la couleur du texte et le premier fond opaque derrière lui. */
async function contraste(el: Locator): Promise<number> {
  return el.evaluate((node) => {
    const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
    const lum = ([r, g, b]: number[]) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const fg = parse(getComputedStyle(node).color);
    let cur: Element | null = node;
    let bg = [255, 255, 255];
    while (cur) {
      const c = parse(getComputedStyle(cur).backgroundColor);
      if (c.length >= 3 && (c.length < 4 || c[3] > 0.9)) {
        bg = c;
        break;
      }
      cur = cur.parentElement;
    }
    const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
    return (a + 0.05) / (b + 0.05);
  });
}

for (const ville of ["Paris", "Marseille"] as const) {
  test(`les textes importants sont lisibles à ${ville}`, async ({ page }) => {
    await creerVie(page, `contraste-${ville}`, ville);
    expect(await contraste(page.locator(".money-value")), "argent").toBeGreaterThanOrEqual(4.5);
    expect(await contraste(page.locator(".money-label")), "libellé argent").toBeGreaterThanOrEqual(4.5);
    await page.getByRole("button", { name: /Faire du sport/ }).click();
    await page.getByRole("button", { name: /Voir la famille/ }).click();
    await page.getByRole("button", { name: "Vivre cette année" }).click();
    await page.getByRole("button", { name: "Action suivante" }).click();
    await page.getByRole("button", { name: "Continuer" }).click();
    const passer = page.getByRole("button", { name: "Passer le mini-jeu" });
    if (await passer.isVisible()) await passer.click();
    expect(await contraste(page.getByText("Événement de l'année")), "titre événement").toBeGreaterThanOrEqual(4.5);
    await page.getByTestId("choix").first().click();
    expect(await contraste(page.locator("section.card h2")), "titre résultat").toBeGreaterThanOrEqual(4.5);
  });
}
