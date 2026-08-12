import { createClient } from "./supabase/client";
import { getUTCDateKey } from "./daily";
import type { GameId } from "./games";

export type Profile = {
  id: string;
  name: string;
  created_at: string;
};

export type SupabaseGameStats = {
  played: number;
  wins: number;
  current_streak: number;
  max_streak: number;
  last_result_date: string | null;
};

function emptySupabaseStats(): SupabaseGameStats {
  return { played: 0, wins: 0, current_streak: 0, max_streak: 0, last_result_date: null };
}

export async function sendMagicLink(email: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  return { error: error?.message ?? null };
}

export async function signOutSupabase() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data as Profile | null;
}

export async function createProfile(userId: string, name: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .insert({ id: userId, name: name.trim().slice(0, 24) })
    .select()
    .single();
  return data as Profile | null;
}

function isConsecutiveDay(prevKey: string, currentKey: string): boolean {
  const prev = new Date(`${prevKey}T00:00:00Z`).getTime();
  const curr = new Date(`${currentKey}T00:00:00Z`).getTime();
  return Math.round((curr - prev) / 86400000) === 1;
}

/** Upserts today's result for the signed-in user. No-ops if already recorded today. */
export async function recordGameResultSupabase(userId: string, gameId: GameId, won: boolean) {
  const supabase = createClient();
  const today = getUTCDateKey();

  const { data: existing } = await supabase
    .from("game_stats")
    .select("*")
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .maybeSingle();

  if (existing?.last_result_date === today) return;

  const played = (existing?.played ?? 0) + 1;
  const wins = (existing?.wins ?? 0) + (won ? 1 : 0);
  let currentStreak = existing?.current_streak ?? 0;
  if (won) {
    currentStreak =
      existing?.last_result_date && isConsecutiveDay(existing.last_result_date, today)
        ? currentStreak + 1
        : 1;
  } else {
    currentStreak = 0;
  }
  const maxStreak = Math.max(existing?.max_streak ?? 0, currentStreak);

  await supabase.from("game_stats").upsert({
    user_id: userId,
    game_id: gameId,
    played,
    wins,
    current_streak: currentStreak,
    max_streak: maxStreak,
    last_result_date: today,
  });
}

export async function getSupabaseStats(userId: string): Promise<Record<GameId, SupabaseGameStats>> {
  const supabase = createClient();
  const { data } = await supabase.from("game_stats").select("*").eq("user_id", userId);

  const result: Record<GameId, SupabaseGameStats> = {
    devtermo: emptySupabaseStats(),
    cacadev: emptySupabaseStats(),
    codebug: emptySupabaseStats(),
    cruzadev: emptySupabaseStats(),
  };
  data?.forEach((row) => {
    result[row.game_id as GameId] = row as SupabaseGameStats;
  });
  return result;
}

export type SupabaseLeaderboardRow = { profile: Profile; stats: SupabaseGameStats };

type GameStatsWithProfile = SupabaseGameStats & { profiles: Profile | null };

export async function getSupabaseLeaderboard(gameId: GameId): Promise<SupabaseLeaderboardRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("game_stats")
    .select("played, wins, current_streak, max_streak, last_result_date, profiles(id, name, created_at)")
    .eq("game_id", gameId)
    .gt("played", 0)
    .order("max_streak", { ascending: false })
    .order("wins", { ascending: false })
    .limit(50);

  const rows = (data ?? []) as unknown as GameStatsWithProfile[];
  return rows
    .filter((row): row is GameStatsWithProfile & { profiles: Profile } => row.profiles !== null)
    .map((row) => ({
      profile: row.profiles,
      stats: {
        played: row.played,
        wins: row.wins,
        current_streak: row.current_streak,
        max_streak: row.max_streak,
        last_result_date: row.last_result_date,
      },
    }));
}
