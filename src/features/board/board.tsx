import React from 'react';
import type { Pos } from './hex';
import { hexPoints } from './hex';
import { useBoardStore } from './useBoard';
import { Cat } from './Cat';

const CELL = 28; // bán kính hợp lý hơn

export function Board() {
  const size      = useBoardStore(s => s.size);
  const grid      = useBoardStore(s => s.grid);
  const cat       = useBoardStore(s => s.cat);
  const blocked   = useBoardStore(s => s.blocked);

  const status       = useBoardStore(s => s.status);
  const setStatus    = useBoardStore(s => s.setStatus);
  const respawnRandom= useBoardStore(s => s.respawnRandom);

  const placeBlock= useBoardStore(s => s.placeBlock);

  const [fading, setFading] = React.useState<'in' | 'out'>('in');


  // --- thông số hex pointy-top odd-r ---
  const R = CELL;                           // bán kính
  const HEX_W = Math.sqrt(3) * R;           // bề ngang 1 hex
  const HEX_H = 2 * R;                      // bề cao 1 hex
  const STEP_X = HEX_W;                     // khoảng cách tâm theo ngang
  const STEP_Y = 0.75 * HEX_H;              // khoảng cách tâm theo dọc (3/4 H)

  const toXY = (p: Pos) => {
    const x = p.c * STEP_X + (p.r % 2 ? STEP_X / 2 : 0);
    const y = p.r * STEP_Y;
    return { x, y };
  };

  // --- kích thước toàn board để canh giữa ---
  const PAD = 16;
  const boardW = size * HEX_W + HEX_W / 2;             // có offset nửa cột
  const boardH = HEX_H + (size - 1) * STEP_Y;          // hàng đầu/cuối chiếm nửa hex
  const vbX = -HEX_W / 2 - PAD;
  const vbY = -HEX_H / 2 - PAD;
  const vbW = boardW + PAD * 2;
  const vbH = boardH + PAD * 2;

  const HEX = React.useMemo(() => hexPoints(R * 0.9, 0.6), [R]); // thu nhỏ hình nhưng giữ spacing

  // ========== NEW: state cho vị trí hiển thị của mèo (px) ==========
  const initialXY = React.useMemo(() => toXY(cat), []); // chỉ tính 1 lần
  const [catXY, setCatXY] = React.useState<{x:number,y:number}>(initialXY);
  const catRef = React.useRef<SVGGElement | null>(null);

  // Khi cat (r,c) đổi, animate translate từ catXY cũ → XY mới
  React.useEffect(() => {
    const target = toXY(cat);
    setCatXY(target); // đổi state → CSS transition dưới sẽ mượt tới vị trí mới
  }, [cat.r, cat.c]); // ràng buộc theo r,c

  React.useEffect(() => {
  let cancelled = false;

  async function runFadeCycle() {
    // Fade-out
    setFading('out');
    await delay(350);                 // thời lượng fade-out (ms)

    if (cancelled) return;

    // Respawn ván mới (đổi seed + init)
    respawnRandom();

    // Fade-in
    setFading('in');
    await delay(350);                 // thời lượng fade-in

    if (cancelled) return;

    // Trở lại chơi
    setStatus('playing');
  }

  if (status === 'done') {
    runFadeCycle();
  }

  return () => { cancelled = true };
}, [status, respawnRandom, setStatus]);


  // style nhóm mèo: transition transform
  const catStyle: React.CSSProperties = {
    transform: `translate(${catXY.x}px, ${catXY.y}px)`,
    transition: 'transform 520ms cubic-bezier(.22,.61,.36,1)', // slow & mượt
    pointerEvents: 'none', // mèo tràn qua ô khác vẫn không chặn click
  };

  return (
    <svg
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full bg-[var(--surface)] rounded-2xl shadow border border-[var(--line)]"
      style={{
        opacity: fading === 'in' ? 1 : 0,
        transition: 'opacity 300ms ease',
      }}
    >

      {grid.map((p, i) => {
        const { x, y } = toXY(p);
        const key = `${p.r},${p.c}`;
        const isBlocked = blocked.has(key);
        const isCat = cat.r === p.r && cat.c === p.c;

        const baseFill = isCat
        ? 'var(--cell)'     // nền ô mèo: để cat nổi bật, ta chuyển nền ô mèo về màu cell
        : isBlocked
        ? 'var(--block)'
        : 'var(--cell)';

        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <polygon
              points={HEX}
              className={
                isCat
                  ? 'fill-amber-400'
                  : isBlocked
                  ? 'fill-indigo-500'
                  : status !== 'playing'
                  ? 'fill-neutral-200 dark:fill-neutral-700'
                  : 'fill-indigo-50 hover:fill-indigo-300 cursor-pointer'
              }
              style={{ fill: baseFill, stroke: 'var(--line)', strokeWidth: 1.2 }}
              onClick={() => {
                if (status !== 'playing') return;
                if (!isBlocked && !isCat) placeBlock(p);
              }}
            />
            {/* {isCat && (
              <g className="cat-hop">
                <Cat size={CELL}/>
              </g>
            )} */}
          </g>
        );
      })}
      <g ref={catRef} style={catStyle}>
        {/* nền hex dưới mèo (tuỳ thích) — để mèo nổi bật, ta dùng màu cell */}
        <Cat size={CELL} scale={1.5} />
      </g>
    </svg>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
