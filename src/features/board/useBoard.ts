import { create } from 'zustand';
import { createGrid, isEdge, seedRandom, neighborsOf } from './hex';
import type { Pos } from './hex';
import { shortestPathStep } from '../algo/bfs';


type Difficulty = 'easy' | 'normal' | 'hard';

type State = {
  size: number;
  grid: Pos[];
  cat: Pos;
  blocked: Set<string>;
  difficulty: Difficulty;
  seed: string;
  turns: number;
  best: number | null;
  status: 'playing' | 'done';
  last?: {
    cat: Pos;
    blocked: Set<string>;
    turns: number;
  };
};

type Actions = {
  init: () => void;
  restart: () => void;
  setDifficulty: (d: Difficulty) => void;
  placeBlock: (p: Pos) => void;
  undo: () => void;
  respawnRandom: () => void;
  setStatus: (s: State['status']) => void;
};

const KEY_BEST = 'ttc_best';
// const KEY_SOUND = 'ttc_sound';  (để dành nếu sau bạn muốn thêm âm thanh)

const getQuery = (k: string) => new URLSearchParams(location.search).get(k) || undefined;

export const useBoardStore = create<State & Actions>((set, get) => ({
  size: 11,
  grid: [],
  cat: { r: 5, c: 5 },               // tạm — sẽ set đúng khi init()
  blocked: new Set(),
  difficulty: (getQuery('difficulty') as Difficulty) || 'normal',
  seed: getQuery('seed') || Math.random().toString(36).slice(2, 10),
  turns: 0,

  best: null,
  status: 'playing',

  init: () => {
    const size = 11;
    const center = { r: Math.floor(size / 2), c: Math.floor(size / 2) };
    const grid = createGrid(size);

    // số ô chặn ban đầu theo độ khó
    const diff = get().difficulty;
    const counts = { easy: 10, normal: 12, hard: 14 };
    const need = counts[diff];

    const rng = seedRandom(get().seed);
    const blocked = new Set<string>();

    // chọn ngẫu nhiên các ô chặn, tránh biên & tránh che ngay ô tâm
    while (blocked.size < need) {
      const r = Math.floor(rng() * size);
      const c = Math.floor(rng() * size);
      const k = `${r},${c}`;
      if ((r === center.r && c === center.c) || isEdge({ r, c }, size)) continue;
      blocked.add(k);
    }

    const bestRaw = localStorage.getItem(KEY_BEST);
    set({
      size,
      grid,
      cat: center,
      blocked,
      turns: 0,
      status: 'playing',
      best: bestRaw ? Number(bestRaw) : null,
    });

    set({ size, grid, cat: center, blocked, turns: 0 });
  },

  restart: () => {
    // giữ nguyên seed & difficulty hiện tại, khởi tạo lại
    get().init();
  },

  undo: () => {
    const last = get().last;
    if (!last || get().status !== 'playing') return;
    set({
      cat: last.cat,
      blocked: last.blocked,
      turns: last.turns,
      last: undefined,
    });
  },

  setDifficulty: (d) => {
    // cập nhật query cho share link đẹp
    const url = new URL(location.href);
    url.searchParams.set('difficulty', d);
    history.replaceState({}, '', url);
    // set({ difficulty: d }, () => get().init());
    set({ difficulty: d })   // chỉ set phần cần đổi
    get().init()  
  },

  setStatus: (s) => set({ status: s }),

  respawnRandom: () => {
    const newSeed = Math.random().toString(36).slice(2, 10);
    set({ seed: newSeed });     // cập nhật seed trước
    get().init();               // rồi init lại theo seed mới
  },

  placeBlock: (p) => {
  const { cat, size, blocked, turns, status, best } = get();
  if (status !== 'playing') return; // đã kết thúc thì không làm gì
  const key = `${p.r},${p.c}`;
  if (blocked.has(key) || (cat.r === p.r && cat.c === p.c)) return;

  // snapshot cho Undo
  const prev = { cat: { ...cat }, blocked: new Set(blocked), turns };

  // 1) Đặt chặn
  const nextBlocked = new Set(blocked);
  nextBlocked.add(key);

  // 2) BFS tìm bước kế tiếp
  // 2) BFS tìm bước kế tiếp tới biên
const step = shortestPathStep({ size, cat, blocked: nextBlocked });

// === NEW: Kiểm tra nước đi hợp lệ xung quanh (không xét đường ra biên) ===
const neighs = neighborsOf(cat, size);
const freeNeighbors = neighs.filter(nb => !nextBlocked.has(`${nb.r},${nb.c}`));

// 2.a) Nếu KHÔNG còn ô kề trống nào → Win (mèo hoàn toàn bị bao vây)
if (freeNeighbors.length === 0) {
  const newTurns = turns + 1;
  const newBest = best === null || newTurns < best ? newTurns : best;
  if (newBest !== best) localStorage.setItem(KEY_BEST, String(newBest));
  set({
    blocked: nextBlocked,
    turns: newTurns,
    status: 'done',
    best: newBest,
    last: prev,
  });
  // (UI-4 sẽ không dùng alert nữa; nếu bạn đã bỏ, xóa dòng dưới)
  // alert('You win!');
  return;
}

// 2.b) Nếu còn ô kề trống:
//     - Nếu có `step` (tồn tại đường ra biên) → mèo đi theo `step`.
//     - Nếu KHÔNG có `step` (không có đường ra biên) → mèo vẫn phải đi,
//       chọn tạm 1 ô trống kề (ở đây chọn ngẫu nhiên cho đơn giản).
const moved = step ?? freeNeighbors[Math.floor(Math.random() * freeNeighbors.length)];

// Cập nhật di chuyển & lượt
set({
  cat: moved,
  blocked: nextBlocked,
  turns: turns + 1,
  last: prev,
});

// 3) Nếu bước mới ở biên → KHÓA và để UI fade/respawn (không alert)
if (isEdge(moved, size)) {
  set({ status: 'done' });
  return;
}


  // 4) Tiếp tục game
  set({
    cat: moved,
    blocked: nextBlocked,
    turns: turns + 1,
    last: prev,
  });
},

}));

