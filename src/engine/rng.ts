/** Hachage xmur3 : transforme une graine texte en entier 32 bits. */
function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

/** Générateur pseudo-aléatoire reproductible (mulberry32). */
export class Rng {
  private state: number;

  constructor(seed: string | number) {
    this.state = typeof seed === "number" ? seed >>> 0 : hashSeed(seed);
  }

  static fromState(state: number): Rng {
    return new Rng(state);
  }

  getState(): number {
    return this.state;
  }

  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error("LISTE_VIDE");
    return items[Math.floor(this.next() * items.length)];
  }

  weightedPick<T extends { weight?: number }>(items: readonly T[]): T {
    const total = items.reduce((s, it) => s + Math.max(0, it.weight ?? 1), 0);
    if (total <= 0) throw new Error("LISTE_VIDE");
    let x = this.next() * total;
    for (const it of items) {
      const w = Math.max(0, it.weight ?? 1);
      if (w === 0) continue;
      if (x < w) return it;
      x -= w;
    }
    return items.filter((it) => (it.weight ?? 1) > 0).at(-1)!;
  }
}
