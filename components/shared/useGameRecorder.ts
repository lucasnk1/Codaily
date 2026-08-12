"use client";

import { useCallback } from "react";
import { useActiveAccount } from "./useActiveAccount";
import { useSupabaseAuth } from "./useSupabaseAuth";
import { recordGameResult } from "@/lib/account";
import { recordGameResultSupabase } from "@/lib/supabaseAccount";
import type { GameId } from "@/lib/games";

/** Combines the local (localStorage) and Supabase (email) identities into
 * one "who's playing, and where should this result be saved" surface. */
export function useGameRecorder(gameId: GameId) {
  const { account, create: createLocalAccount } = useActiveAccount();
  const { user, profile } = useSupabaseAuth();

  const hasIdentity = (!!user && !!profile) || !!account;

  const record = useCallback(
    (won: boolean) => {
      if (user && profile) {
        recordGameResultSupabase(user.id, gameId, won);
      } else if (account) {
        recordGameResult(gameId, won);
      }
    },
    [user, profile, account, gameId]
  );

  return { hasIdentity, record, createLocalAccount };
}
