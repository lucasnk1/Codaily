"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, User as UserIcon, X } from "lucide-react";
import { useActiveAccount } from "@/components/shared/useActiveAccount";
import AccountNameForm from "@/components/shared/AccountNameForm";
import AccountHome from "./AccountHome";
import Leaderboard from "./Leaderboard";
import type { GameId } from "@/lib/games";

type PanelTab = "home" | "leaderboard";

type AccountPanelProps = {
  open: boolean;
  onClose: () => void;
  onNavigateGame: (id: GameId) => void;
};

export default function AccountPanel({ open, onClose, onNavigateGame }: AccountPanelProps) {
  const { account, create, logout } = useActiveAccount();
  const [tab, setTab] = useState<PanelTab>("home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-border bg-bg-card p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">Conta</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-text-muted hover:bg-bg-subtle hover:text-text-primary"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {account ? (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-bg-subtle px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 font-mono text-sm font-semibold text-accent">
                {account.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-text-primary">{account.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary"
            >
              <LogOut size={13} /> Sair
            </button>
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-bg-subtle px-3 py-2 text-text-secondary">
            <UserIcon size={16} />
            <span className="text-xs">Jogando sem conta — nada é salvo</span>
          </div>
        )}

        <div className="mb-4 flex items-center gap-1 rounded-full border border-border bg-bg p-1">
          <button onClick={() => setTab("home")} className={pillClass(tab === "home")}>
            Home
          </button>
          <button onClick={() => setTab("leaderboard")} className={pillClass(tab === "leaderboard")}>
            Leaderboard
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none">
          {tab === "home" ? (
            account ? (
              <AccountHome
                accountId={account.id}
                onNavigateGame={(id) => {
                  onNavigateGame(id);
                  onClose();
                }}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-text-secondary">
                  Crie uma conta local para salvar suas estatísticas e aparecer no leaderboard. Sem
                  senha, sem e-mail — só o nome, guardado neste navegador.
                </p>
                <AccountNameForm onSubmit={create} submitLabel="Criar conta" />
              </div>
            )
          ) : (
            <Leaderboard activeAccountId={account?.id ?? null} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function pillClass(active: boolean) {
  return [
    "flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
    active ? "bg-bg-card text-text-primary shadow-glow" : "text-text-secondary hover:text-text-primary",
  ].join(" ");
}
