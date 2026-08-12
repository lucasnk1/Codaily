"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { getSupabaseLeaderboard, type SupabaseLeaderboardRow } from "@/lib/supabaseAccount";
import { ALL_GAME_IDS, GAME_LABELS, type GameId } from "@/lib/games";

export default function Leaderboard({ activeUserId }: { activeUserId: string | null }) {
  const [gameId, setGameId] = useState<GameId>("devtermo");
  const [rows, setRows] = useState<SupabaseLeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSupabaseLeaderboard(gameId)
      .then(setRows)
      .finally(() => setLoading(false));
  }, [gameId]);

  return (
    <div>
      <p className="mb-3 text-xs text-text-muted">
        Ranking global de quem entrou com e-mail. Contas locais não aparecem aqui.
      </p>

      <div className="mb-3 flex flex-wrap gap-1">
        {ALL_GAME_IDS.map((id) => (
          <button
            key={id}
            onClick={() => setGameId(id)}
            className={[
              "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
              gameId === id
                ? "bg-accent text-white"
                : "bg-bg text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            {GAME_LABELS[id]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-text-muted">Carregando…</p>
      ) : rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-muted">
          Ninguém jogou {GAME_LABELS[gameId]} ainda.
        </p>
      ) : (
        <ol className="space-y-1.5">
          {rows.map((row, i) => (
            <li
              key={row.profile.id}
              className={[
                "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
                row.profile.id === activeUserId
                  ? "border-accent/40 bg-accent/10"
                  : "border-border bg-bg",
              ].join(" ")}
            >
              <span className="flex items-center gap-2">
                <span className="w-4 font-mono text-xs text-text-muted">{i + 1}</span>
                <span className="font-medium text-text-primary">{row.profile.name}</span>
              </span>
              <span className="flex items-center gap-3 font-mono text-xs text-text-secondary">
                <span>
                  {row.stats.wins}/{row.stats.played}
                </span>
                <span className="flex items-center gap-0.5 text-feedback-present">
                  <Flame size={12} /> {row.stats.max_streak}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
