import { Header } from './features/ui/header'
import { Footer } from './features/ui/footer'
import { Board } from './features/board/board'
import { useBoardStore } from './features/board/useBoard'
import React from 'react'

export default function App() {
  const init = useBoardStore(s => s.init)

  React.useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 gap-4">
      <Header />
      <main className="w-full max-w-3xl aspect-square">
        <Board />
      </main>
      <Footer />
    </div>
  )
}
