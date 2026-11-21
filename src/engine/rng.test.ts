import { describe, expect, test } from "vitest";
import { Rng } from "./rng";

describe("Rng", () => {
  test("la même graine donne la même suite", () => {
    const a = new Rng("abc");
    const b = new Rng("abc");
    const sa = Array.from({ length: 5 }, () => a.next());
    const sb = Array.from({ length: 5 }, () => b.next());
    expect(sa).toEqual(sb);
    const c = new Rng("abd");
    expect(Array.from({ length: 5 }, () => c.next())).not.toEqual(sa);
  });

  test("next reste dans [0, 1)", () => {
    const r = new Rng(42);
    for (let i = 0; i < 1000; i++) {
      const x = r.next();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });

  test("fromState reprend exactement la suite", () => {
    const r = new Rng("reprise");
    r.next();
    r.next();
    const copie = Rng.fromState(r.getState());
    expect(Array.from({ length: 5 }, () => copie.next())).toEqual(
      Array.from({ length: 5 }, () => r.next()),
    );
  });

  test("int respecte ses bornes incluses", () => {
    const r = new Rng("de");
    const vus = new Set<number>();
    for (let i = 0; i < 1000; i++) {
      const x = r.int(1, 6);
      expect(x).toBeGreaterThanOrEqual(1);
      expect(x).toBeLessThanOrEqual(6);
      vus.add(x);
    }
    expect(vus.has(1)).toBe(true);
    expect(vus.has(6)).toBe(true);
  });

  test("weightedPick ignore les poids nuls et vaut 1 par défaut", () => {
    const r = new Rng("poids");
    for (let i = 0; i < 200; i++) {
      expect(r.weightedPick([{ id: "a", weight: 0 }, { id: "b", weight: 1 }]).id).toBe("b");
    }
    const vus = new Set<string>();
    for (let i = 0; i < 200; i++) vus.add(r.weightedPick([{ id: "x" }, { id: "y" }]).id);
    expect(vus).toEqual(new Set(["x", "y"]));
  });

  test("pick et chance", () => {
    const r = new Rng("p");
    expect(["a"]).toContain(r.pick(["a"]));
    expect(r.chance(0)).toBe(false);
    expect(r.chance(1)).toBe(true);
  });
});
