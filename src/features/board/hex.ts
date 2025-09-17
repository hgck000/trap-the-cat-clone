// Kiểu toạ độ hàng (row) / cột (column)
export type Pos = { r: number; c: number };

// Tạo danh sách tất cả ô cho grid size x size
export function createGrid(size: number): Pos[] {
  const out: Pos[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) out.push({ r, c });
  }
  return out;
}

// Ô ở biên?
export const isEdge = (p: Pos, size: number) =>
  p.r === 0 || p.c === 0 || p.r === size - 1 || p.c === size - 1;

// Láng giềng theo hệ odd-r offset (hàng lẻ lệch phải)
export function neighborsOf(p: Pos, size: number): Pos[] {
  const evenRow = p.r % 2 === 0;
  // Với odd-r: hàng CHẴN (0,2,4,...) lệch sang trái so với hàng lẻ
  // Ta định nghĩa 6 hướng: 2 chéo trên, 2 ngang, 2 chéo dưới
  const deltas = evenRow
    ? [ [-1,0], [-1,-1], [0,-1], [0,1], [1,0], [1,-1] ] // hàng chẵn
    : [ [-1,0], [-1,1], [0,-1], [0,1], [1,0], [1,1]  ]; // hàng lẻ
  const ns: Pos[] = [];
  for (const [dr, dc] of deltas) {
    const r = p.r + dr, c = p.c + dc;
    if (r >= 0 && c >= 0 && r < size && c < size) ns.push({ r, c });
  }
  return ns;
}

// PRNG đơn giản theo seed (deterministic)
export function seedRandom(seed: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function rnd() {
    h += 0x6D2B79F5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
