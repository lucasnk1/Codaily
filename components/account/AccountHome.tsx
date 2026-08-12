"use client";

import { Flame } from "lucide-react";
import type { StatsByGame } from "@/lib/account";
import { ALL_GAME_IDS, GAME_LABELS, type GameId } from "@/lib/games";

type AccountHomeProps = {
  stats: StatsByGame | null;
  onNavigateGame: (id: GameId) => void;
};

export default function AccountHome({ stats, onNavigateGame }: AccountHomeProps) {
  if (!stats) {
    return <p className="py-6 text-center text-sm text-text-muted">Carregando…</p>;
  }

  return (
    <div className="space-y-2">
      {ALL_GAME_IDS.map((id) => {
        const s = stats[id];
        return (
          <button
            key={id}
            onClick={() => onNavigateGame(id)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-bg px-3 py-2.5 text-left transition-colors hover:border-accent/40"
          >
            <span className="text-sm font-medium text-text-primary">{GAME_LABELS[id]}</span>
            <span className="flex items-center gap-3 font-mono text-xs text-text-secondary">
              <span>
                {s.wins}/{s.played}
              </span>
              <span className="flex items-center gap-0.5 text-feedback-present">
                <Flame size={12} /> {s.currentStreak}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
