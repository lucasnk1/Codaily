"use client";

import { useState } from "react";
import Header from "@/components/Header";
import GameTabs, { type GameId } from "@/components/GameTabs";
import DevTermo from "@/components/devtermo/DevTermo";
import CacaDev from "@/components/cacadev/CacaDev";
import CodeBug from "@/components/codebug/CodeBug";
import CruzaDev from "@/components/cruzadev/CruzaDev";

export default function Home() {
  const [activeGame, setActiveGame] = useState<GameId>("devtermo");
  const [streak, setStreak] = useState(5);

  function handleGameEnd(won: boolean) {
    setStreak((s) => (won ? s + 1 : 0));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header streak={streak} />
      <GameTabs active={activeGame} onChange={setActiveGame} />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
        {activeGame === "devtermo" && <DevTermo onGameEnd={handleGameEnd} />}
        {activeGame === "cacadev" && <CacaDev onGameEnd={handleGameEnd} />}
        {activeGame === "codebug" && <CodeBug onGameEnd={handleGameEnd} />}
        {activeGame === "cruzadev" && <CruzaDev onGameEnd={handleGameEnd} />}
      </main>
    </div>
  );
}
