import type { Pos } from './hex';
import { useBoardStore } from './useBoard';

const CELL = 34;

export function Board() {
  const size = useBoardStore(s => s.size);
  const grid = useBoardStore(s => s.grid);
  const cat = useBoardStore(s => s.cat);
  const blocked = useBoardStore(s => s.blocked);
  const status = useBoardStore(s => s.status);
  const placeBlock = useBoardStore(s => s.placeBlock);

  const toXY = (p: Pos) => {
    const x = p.c * CELL * 2 + (p.r % 2 ? CELL : 0);
    const y = p.r * (CELL * 1.732 / 1.2);
    return { x, y };
  };

  const w = size * CELL * 2 + CELL;
  const h = size * CELL * 1.8;

  return (
    <svg
      viewBox={`-16 -16 ${w + 32} ${h + 32}`}
      className="w-full h-full bg-white dark:bg-neutral-800 rounded-2xl shadow"
    >
      {grid.map((p, i) => {
        const { x, y } = toXY(p);
        const k = `${p.r},${p.c}`;
        const isBlocked = blocked.has(k);
        const isCat = (p.r === cat.r && p.c === cat.c);

        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <circle
              r={CELL * 0.48}
              className={
                isCat
                  ? 'fill-amber-400'
                  : isBlocked
                  ? 'fill-indigo-500'
                  : status !== 'playing'
                  ? 'fill-neutral-200 dark:fill-neutral-700'
                  : 'fill-indigo-50 hover:fill-indigo-300 cursor-pointer'
              }
              onClick={() => {
                if (!isBlocked && !isCat) placeBlock(p);
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
