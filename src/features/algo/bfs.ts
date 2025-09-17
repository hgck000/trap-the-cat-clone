import { isEdge } from '../board/hex';
import type { Pos } from '../board/hex';
import { neighborsOf } from '../board/hex';

type Input = {
  size: number;
  cat: Pos;
  blocked: Set<string>; // set "r,c"
};

/**
 * Tìm bước KẾ TIẾP theo đường đi ngắn nhất từ vị trí mèo đến bất kỳ cạnh (edge).
 * Nếu không có đường → null (nghĩa là người chơi thắng).
 */
export function shortestPathStep({ size, cat, blocked }: Input): Pos | null {
  const key = (p: Pos) => `${p.r},${p.c}`;

  // Hàng đợi BFS
  const q: Pos[] = [cat];
  // Đánh dấu đã thăm
  const seen = new Set<string>([key(cat)]);
  // Lưu cha để truy vết
  const prev = new Map<string, Pos>();

  while (q.length) {
    const cur = q.shift()!;

    // điều kiện dừng: đụng biên (không phải là chính ô xuất phát)
    if (isEdge(cur, size) && !(cur.r === cat.r && cur.c === cat.c)) {
      // truy vết ngược về bước ngay-sau-cat
      let t: Pos = cur;
      while (prev.get(key(t)) && !(prev.get(key(t))!.r === cat.r && prev.get(key(t))!.c === cat.c)) {
        t = prev.get(key(t))!;
      }
      return t; // đây là BƯỚC KẾ TIẾP
    }

    for (const nb of neighborsOf(cur, size)) {
      const k = key(nb);
      if (seen.has(k) || blocked.has(k)) continue;
      seen.add(k);
      prev.set(k, cur);
      q.push(nb);
    }
  }

  // Hết queue mà không gặp biên → không có đường
  return null;
}
