import { useBoardStore } from '../board/useBoard'

export function Header() {
  const turns = useBoardStore(s => s.turns)
  const best = useBoardStore(s => s.best)
  const restart = useBoardStore(s => s.restart)
  const diff = useBoardStore(s => s.difficulty)
  const setDiff = useBoardStore(s => s.setDifficulty)
  const undo = useBoardStore(s => s.undo)
  const status = useBoardStore(s => s.status)

  return (
    <header className="w-full max-w-3xl flex items-center justify-between gap-2">
      <h1 className="text-xl font-semibold">Trap the Cat</h1>

      <div className="flex items-center gap-2">
        <select
          className="px-2 py-1 rounded border border-[var(--line)] bg-[var(--surface)]"
          value={diff}
          onChange={e => setDiff(e.target.value as any)}
          disabled={status !== 'playing'}  // đổi độ khó khi đang chơi? tuỳ bạn. Ở đây mình khoá để tránh reset bất ngờ
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>

        <button
          className="px-3 py-1 rounded bg-[var(--surface-2)] border border-[var(--line)] disabled:opacity-50"
          onClick={undo}
          disabled={status !== 'playing'}
        >
          Undo
        </button>

        <button
          className="px-3 py-1 rounded bg-[var(--primary)] text-white hover:brightness-95"
          onClick={restart}
        >
          Restart
        </button>

      </div>

      <div className="text-sm text-[var(--text-weak)]">
        Turns: <b className="text-[var(--text)]">{turns}</b>
        {' '}· Best: <b className="text-[var(--text)]">{best ?? '—'}</b>
      </div>
    </header>
  )
}
