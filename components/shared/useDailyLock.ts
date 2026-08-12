"use client";

import { useCallback, useEffect, useState } from "react";
import { getUTCDateKey } from "@/lib/daily";

export type DailyResult = {
  won: boolean;
  shareText: string;
};

type StoredDaily = {
  dateKey: string;
  result: DailyResult;
};

export function useDailyLock(gameId: string) {
  const [status, setStatus] = useState<"loading" | "locked" | "unlocked">("loading");
  const [result, setResult] = useState<DailyResult | null>(null);

  useEffect(() => {
    const storageKey = `codaily:${gameId}`;
    const raw = window.localStorage.getItem(storageKey);
    const todayKey = getUTCDateKey();

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as StoredDaily;
        if (parsed.dateKey === todayKey) {
          setResult(parsed.result);
          setStatus("locked");
          return;
        }
      } catch {
        // stored value corrupted — treat as unlocked
      }
    }
    setStatus("unlocked");
  }, [gameId]);

  // Persists the result for future visits without flipping the current
  // session to the "locked" screen — the player who just finished should
  // still see their completion modal, not the "already played" screen.
  // The lock only takes effect the next time this hook mounts fresh.
  const complete = useCallback(
    (dailyResult: DailyResult) => {
      const storageKey = `codaily:${gameId}`;
      const todayKey = getUTCDateKey();
      const stored: StoredDaily = { dateKey: todayKey, result: dailyResult };
      window.localStorage.setItem(storageKey, JSON.stringify(stored));
    },
    [gameId]
  );

  return { status, result, complete };
}
