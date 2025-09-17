import { useBoardStore } from '../board/useBoard'

export function Footer() {
  const seed = useBoardStore(s => s.seed)
  const difficulty = useBoardStore(s => s.difficulty)

  const share = () => {
    const url = new URL(location.href)
    url.searchParams.set('seed', seed)
    url.searchParams.set('difficulty', difficulty)
    navigator.clipboard.writeText(url.toString())
    alert('Copied shareable link!')
  }

  return (
    <footer className="w-full max-w-3xl flex items-center justify-between">
      <p className="text-sm text-[var(--text-weak)]">Seed: {seed}</p>
      <button className="px-3 py-1 rounded bg-[var(--surface-2)] border border-[var(--line)]" onClick={share}>
        Share this board
      </button>
    </footer>
  )
}
