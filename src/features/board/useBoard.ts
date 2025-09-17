import { create } from 'zustand';
import { createGrid, isEdge, seedRandom } from './hex';
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
  status: 'playing' | 'won' | 'lost';
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
    set({ difficulty: d }, () => get().init());
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
  const step = shortestPathStep({ size, cat, blocked: nextBlocked });

  // 2.a) Không có đường → Win
  if (!step) {
    const newTurns = turns + 1;
    const newBest = best === null || newTurns < best ? newTurns : best;
    if (newBest !== best) localStorage.setItem(KEY_BEST, String(newBest));
    set({
      blocked: nextBlocked,
      turns: newTurns,
      status: 'won',
      best: newBest,
      last: prev,
    });
    alert('You win!');
    return;
  }

  // 2.b) Có đường → mèo đi 1 bước
  const moved = step;

  // 3) Nếu bước mới ở biên → Lose
  if (isEdge(moved, size)) {
    set({
      cat: moved,
      blocked: nextBlocked,
      turns: turns + 1,
      status: 'lost',
      last: prev,
    });
    alert('Cat escaped!');
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
