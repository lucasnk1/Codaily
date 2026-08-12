import { getUTCDateKey } from "./daily";
import { ALL_GAME_IDS, type GameId } from "./games";

export type Account = {
  id: string;
  name: string;
  createdAt: string;
};

export type GameStats = {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  lastResultDate: string | null;
};

export type StatsByGame = Record<GameId, GameStats>;

const ACCOUNTS_KEY = "codaily:accounts";
const ACTIVE_KEY = "codaily:activeAccountId";
const STATS_PREFIX = "codaily:stats:";

// Every component calls useActiveAccount() independently, so a plain
// per-call read would leave siblings (e.g. the header) stuck showing
// stale data after another component creates/switches an account.
// A tiny pub/sub lets useSyncExternalStore keep them all in sync.
type Listener = () => void;
const listeners = new Set<Listener>();
let cachedActiveAccount: Account | null | undefined;

export function subscribeActiveAccount(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function invalidateActiveAccount() {
  cachedActiveAccount = computeActiveAccount();
  listeners.forEach((l) => l());
}

export function getActiveAccountSnapshot(): Account | null {
  if (cachedActiveAccount === undefined) {
    cachedActiveAccount = typeof window === "undefined" ? null : computeActiveAccount();
  }
  return cachedActiveAccount;
}

function emptyGameStats(): GameStats {
  return { played: 0, wins: 0, currentStreak: 0, maxStreak: 0, lastResultDate: null };
}

export function emptyStats(): StatsByGame {
  return ALL_GAME_IDS.reduce((acc, id) => {
    acc[id] = emptyGameStats();
    return acc;
  }, {} as StatsByGame);
}

export function getAccounts(): Account[] {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as Account[]) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: Account[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getActiveAccountId(): string | null {
  return window.localStorage.getItem(ACTIVE_KEY);
}

function computeActiveAccount(): Account | null {
  const id = getActiveAccountId();
  if (!id) return null;
  return getAccounts().find((a) => a.id === id) ?? null;
}

export function getActiveAccount(): Account | null {
  return computeActiveAccount();
}

export function createAccount(name: string): Account {
  const trimmed = name.trim().slice(0, 24);
  const account: Account = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    name: trimmed,
    createdAt: new Date().toISOString(),
  };
  const accounts = getAccounts();
  accounts.push(account);
  saveAccounts(accounts);
  window.localStorage.setItem(ACTIVE_KEY, account.id);
  window.localStorage.setItem(STATS_PREFIX + account.id, JSON.stringify(emptyStats()));
  invalidateActiveAccount();
  return account;
}

export function setActiveAccount(id: string | null) {
  if (id) window.localStorage.setItem(ACTIVE_KEY, id);
  else window.localStorage.removeItem(ACTIVE_KEY);
  invalidateActiveAccount();
}

export function getStats(accountId: string): StatsByGame {
  try {
    const raw = window.localStorage.getItem(STATS_PREFIX + accountId);
    if (!raw) return emptyStats();
    return { ...emptyStats(), ...(JSON.parse(raw) as Partial<StatsByGame>) };
  } catch {
    return emptyStats();
  }
}

function saveStats(accountId: string, stats: StatsByGame) {
  window.localStorage.setItem(STATS_PREFIX + accountId, JSON.stringify(stats));
}

function isConsecutiveDay(prevKey: string, currentKey: string): boolean {
  const prev = new Date(`${prevKey}T00:00:00Z`).getTime();
  const curr = new Date(`${currentKey}T00:00:00Z`).getTime();
  return Math.round((curr - prev) / 86400000) === 1;
}

/** Records a finished game's result for the active account. No-ops (returns false) if no account is active. */
export function recordGameResult(gameId: GameId, won: boolean): boolean {
  const account = getActiveAccount();
  if (!account) return false;

  const stats = getStats(account.id);
  const g = stats[gameId];
  const today = getUTCDateKey();

  if (g.lastResultDate === today) return true; // already recorded today, avoid double count

  g.played += 1;
  if (won) {
    g.wins += 1;
    g.currentStreak = g.lastResultDate && isConsecutiveDay(g.lastResultDate, today) ? g.currentStreak + 1 : 1;
    g.maxStreak = Math.max(g.maxStreak, g.currentStreak);
  } else {
    g.currentStreak = 0;
  }
  g.lastResultDate = today;

  saveStats(account.id, stats);
  return true;
}

export type LeaderboardRow = { account: Account; stats: GameStats };

export function getLeaderboard(gameId: GameId): LeaderboardRow[] {
  return getAccounts()
    .map((account) => ({ account, stats: getStats(account.id)[gameId] }))
    .filter((row) => row.stats.played > 0)
    .sort((a, b) => b.stats.maxStreak - a.stats.maxStreak || b.stats.wins - a.stats.wins);
}

export type { GameId };
