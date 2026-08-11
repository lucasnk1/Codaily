"use client";

import { motion } from "framer-motion";

export type GameId = "devtermo" | "cacadev" | "codebug";

const GAMES: { id: GameId; label: string; available: boolean }[] = [
  { id: "devtermo", label: "DevTermo", available: true },
  { id: "cacadev", label: "Caça-Dev", available: true },
  { id: "codebug", label: "CodeBug", available: true },
];

type GameTabsProps = {
  active: GameId;
  onChange: (id: GameId) => void;
};

export default function GameTabs({ active, onChange }: GameTabsProps) {
  return (
    <nav className="mx-auto flex max-w-3xl justify-center gap-1 px-4 py-3">
      <div className="flex items-center gap-1 rounded-full border border-border bg-bg-card p-1">
        {GAMES.map((game) => {
          const isActive = game.id === active;
          return (
            <button
              key={game.id}
              disabled={!game.available}
              onClick={() => game.available && onChange(game.id)}
              className={[
                "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                game.available
                  ? "text-text-secondary hover:text-text-primary"
                  : "cursor-not-allowed text-text-muted",
              ].join(" ")}
            >
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-bg-subtle shadow-glow"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? "text-text-primary" : ""}`}>
                {game.label}
              </span>
              {!game.available && (
                <span className="relative z-10 ml-1.5 text-[10px] uppercase tracking-wide text-text-muted">
                  em breve
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
