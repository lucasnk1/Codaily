"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, Mail, User as UserIcon, X } from "lucide-react";
import { useActiveAccount } from "@/components/shared/useActiveAccount";
import { useSupabaseAuth } from "@/components/shared/useSupabaseAuth";
import AccountNameForm from "@/components/shared/AccountNameForm";
import EmailLoginForm from "@/components/shared/EmailLoginForm";
import AccountHome from "./AccountHome";
import Leaderboard from "./Leaderboard";
import { getStats, type StatsByGame } from "@/lib/account";
import { createProfile, getSupabaseStats, signOutSupabase } from "@/lib/supabaseAccount";
import { ALL_GAME_IDS, type GameId } from "@/lib/games";

function normalizeSupabaseStats(
  raw: Awaited<ReturnType<typeof getSupabaseStats>>
): StatsByGame {
  return ALL_GAME_IDS.reduce((acc, id) => {
    const s = raw[id];
    acc[id] = {
      played: s.played,
      wins: s.wins,
      currentStreak: s.current_streak,
      maxStreak: s.max_streak,
      lastResultDate: s.last_result_date,
    };
    return acc;
  }, {} as StatsByGame);
}

type PanelTab = "home" | "leaderboard";

type AccountPanelProps = {
  open: boolean;
  onClose: () => void;
  onNavigateGame: (id: GameId) => void;
};

export default function AccountPanel({ open, onClose, onNavigateGame }: AccountPanelProps) {
  const { account, create, logout } = useActiveAccount();
  const { user, profile, refreshProfile } = useSupabaseAuth();
  const [tab, setTab] = useState<PanelTab>("home");
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<StatsByGame | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (user && profile) {
      getSupabaseStats(user.id).then((raw) => setStats(normalizeSupabaseStats(raw)));
    } else if (account) {
      setStats(getStats(account.id));
    } else {
      setStats(null);
    }
  }, [user, profile, account]);

  if (!mounted || !open) return null;

  const hasSupabaseIdentity = !!user;
  const needsProfileName = hasSupabaseIdentity && !profile;
  const hasLocalIdentity = !!account;
  const hasAnyIdentity = (hasSupabaseIdentity && !!profile) || hasLocalIdentity;

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

        {profile ? (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-bg-subtle px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 font-mono text-sm font-semibold text-accent">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">{profile.name}</span>
                <span className="text-[10px] text-text-muted">conta com e-mail</span>
              </div>
            </div>
            <button
              onClick={signOutSupabase}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary"
            >
              <LogOut size={13} /> Sair
            </button>
          </div>
        ) : needsProfileName ? (
          <div className="mb-4 rounded-lg border border-border bg-bg-subtle p-3">
            <p className="mb-2 text-sm text-text-secondary">
              Você entrou! Só falta escolher um nome pra aparecer no leaderboard.
            </p>
            <AccountNameForm
              submitLabel="Salvar"
              onSubmit={async (name) => {
                if (user) {
                  await createProfile(user.id, name);
                  refreshProfile();
                }
              }}
            />
          </div>
        ) : account ? (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-bg-subtle px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 font-mono text-sm font-semibold text-accent">
                {account.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">{account.name}</span>
                <span className="text-[10px] text-text-muted">conta local</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary"
            >
              <LogOut size={13} /> Sair
            </button>
          </div>
        ) : (
          <div className="mb-4 space-y-3 rounded-lg border border-border bg-bg-subtle p-3">
            <div className="flex items-center gap-2 text-text-secondary">
              <UserIcon size={16} />
              <span className="text-xs">Jogando sem conta — nada é salvo</span>
            </div>
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <Mail size={12} /> Entrar com e-mail (sincroniza e entra no leaderboard)
              </p>
              <EmailLoginForm />
            </div>
            <div className="border-t border-border pt-3">
              <p className="mb-1.5 text-xs font-medium text-text-secondary">
                Ou crie uma conta local (só neste navegador)
              </p>
              <AccountNameForm onSubmit={create} submitLabel="Criar conta local" />
            </div>
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
            hasAnyIdentity ? (
              <AccountHome
                stats={stats}
                onNavigateGame={(id) => {
                  onNavigateGame(id);
                  onClose();
                }}
              />
            ) : (
              <p className="py-6 text-center text-sm text-text-muted">
                Crie uma conta para ver suas estatísticas aqui.
              </p>
            )
          ) : (
            <Leaderboard activeUserId={user?.id ?? null} />
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
