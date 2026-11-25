import { describe, expect, test } from "vitest";
import { newLife } from "@/engine";
import { SAVE_KEY, clearLife, loadLife, saveLife } from "./save";

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(k: string) {
    return this.data.has(k) ? this.data.get(k)! : null;
  }
  key(i: number) {
    return [...this.data.keys()][i] ?? null;
  }
  removeItem(k: string) {
    this.data.delete(k);
  }
  setItem(k: string, v: string) {
    this.data.set(k, v);
  }
}

class BrokenStorage extends MemoryStorage {
  getItem(): string | null {
    throw new Error("bloqué");
  }
  setItem(): void {
    throw new Error("plein");
  }
}

const vie = newLife({ name: "Inès", city: "paris", district: "Paris 18e", skin: "#C68A62" }, "save");

describe("sauvegarde", () => {
  test("sauvegarder puis charger", () => {
    const st = new MemoryStorage();
    saveLife(vie, st);
    expect(loadLife(st)).toEqual(vie);
  });

  test("valeur abîmée", () => {
    const st = new MemoryStorage();
    st.setItem(SAVE_KEY, "{oups");
    expect(loadLife(st)).toBeNull();
  });

  test("ancienne version ou champs manquants", () => {
    const st = new MemoryStorage();
    st.setItem(SAVE_KEY, JSON.stringify({ ...vie, version: 0 }));
    expect(loadLife(st)).toBeNull();
    st.setItem(SAVE_KEY, JSON.stringify({ ...vie, gauges: undefined }));
    expect(loadLife(st)).toBeNull();
    st.setItem(SAVE_KEY, JSON.stringify({ ...vie, phase: "pause" }));
    expect(loadLife(st)).toBeNull();
    st.setItem(SAVE_KEY, JSON.stringify({ ...vie, gauges: { ...vie.gauges, health: "beaucoup" } }));
    expect(loadLife(st)).toBeNull();
  });

  test("stockage inaccessible", () => {
    const st = new BrokenStorage();
    expect(loadLife(st)).toBeNull();
    expect(() => saveLife(vie, st)).not.toThrow();
  });

  test("une sauvegarde de la version 1 est migrée", () => {
    const st = new MemoryStorage();
    const v1 = {
      version: 1, seed: "old", rngState: 42,
      character: { name: "Léa", city: "paris", district: "Paris 11e", skin: "#C68A62" },
      familyStart: "moyenne", age: 30,
      gauges: { money: 5000, health: 70, morale: 50, reputation: 20, family: 60 },
      career: "livreur", careerLevel: 1, formations: 0, flags: [], seenEvents: ["loyer-hausse"],
      eventQueue: [], currentEventId: null, lastResult: null, phase: "actions", deathCause: null,
      history: [],
    };
    st.setItem(SAVE_KEY, JSON.stringify(v1));
    const vie2 = loadLife(st);
    expect(vie2).not.toBeNull();
    expect(vie2!.version).toBe(2);
    expect(vie2!.relation).toBe("celibataire");
    expect(vie2!.childrenAges).toEqual([]);
    expect(vie2!.cinematics).toEqual([]);
    expect(vie2!.age).toBe(30);
    expect(vie2!.phase).toBe("actions");
  });

  test("effacer", () => {
    const st = new MemoryStorage();
    saveLife(vie, st);
    clearLife(st);
    expect(loadLife(st)).toBeNull();
  });
});
