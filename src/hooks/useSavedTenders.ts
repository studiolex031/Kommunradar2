import { useSyncExternalStore, useCallback } from "react";
import { getSavedIds, subscribeStorage, toggleSaved } from "@/lib/storage";

const EMPTY: string[] = [];
const getServerSnapshot = () => EMPTY;

export function useSavedTenders() {
  const savedIds = useSyncExternalStore(subscribeStorage, getSavedIds, getServerSnapshot);

  const toggle = useCallback((id: string) => toggleSaved(id), []);
  const has = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return { savedIds, toggle, has, count: savedIds.length };
}
