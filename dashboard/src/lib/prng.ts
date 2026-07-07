/** Простой детерминированный ГПСЧ (mulberry32) на основе строкового seed. */
function hashStringToInt(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

export function seededRandom(seedStr: string): () => number {
  let a = hashStringToInt(seedStr);
  return function mulberry32() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Число с плавающей точкой в диапазоне [min, max), детерминированное по seed. */
export function seededRange(seedStr: string, min: number, max: number): number {
  const rng = seededRandom(seedStr);
  return min + rng() * (max - min);
}
