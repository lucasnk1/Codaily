"use client";

import { useState } from "react";
import { User } from "lucide-react";
import AccountPanel from "@/components/account/AccountPanel";
import { useActiveAccount } from "@/components/shared/useActiveAccount";
import { useSupabaseAuth } from "@/components/shared/useSupabaseAuth";
import type { GameId } from "@/lib/games";

export default function Header({ onNavigateGame }: { onNavigateGame: (id: GameId) => void }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const { account } = useActiveAccount();
  const { profile } = useSupabaseAuth();

  const displayName = profile?.name ?? account?.name ?? null;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-14 max-w-3xl items-center justify-center px-4">
        <span className="font-mono text-lg font-semibold tracking-tight text-text-primary">
          <span className="text-accent">{"</>"}</span> Codaily
        </span>

        <button
          onClick={() => setPanelOpen(true)}
          aria-label="Conta"
          className="absolute right-4 flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
        >
          {displayName ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 font-mono text-xs font-semibold text-accent">
              {displayName.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User size={18} />
          )}
        </button>
      </div>

      <AccountPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onNavigateGame={onNavigateGame}
      />
    </header>
  );
}
