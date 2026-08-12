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

  return (
    <div className="flex min-h-screen flex-col">
      <Header onNavigateGame={setActiveGame} />
      <GameTabs active={activeGame} onChange={setActiveGame} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4">
        {activeGame === "devtermo" && <DevTermo />}
        {activeGame === "cacadev" && <CacaDev />}
        {activeGame === "codebug" && <CodeBug />}
        {activeGame === "cruzadev" && <CruzaDev />}
      </main>
    </div>
  );
}
