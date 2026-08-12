"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  createAccount as createAccountFn,
  getActiveAccountSnapshot,
  setActiveAccount as setActiveAccountFn,
  subscribeActiveAccount,
} from "@/lib/account";

function getServerSnapshot() {
  return null;
}

export function useActiveAccount() {
  const account = useSyncExternalStore(subscribeActiveAccount, getActiveAccountSnapshot, getServerSnapshot);

  const create = useCallback((name: string) => createAccountFn(name), []);
  const logout = useCallback(() => setActiveAccountFn(null), []);
  const switchTo = useCallback((id: string) => setActiveAccountFn(id), []);

  return { account, loaded: true, create, logout, switchTo };
}
