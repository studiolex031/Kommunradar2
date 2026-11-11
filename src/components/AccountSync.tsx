import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PROFILE_KEY, useAccount, useProfile } from "@/hooks/useAccount";
import { emptyProfile, isSyncableId, saveProfile, type AccountProfile } from "@/lib/account";
import { getSavedIds, setSavedIds, subscribeStorage } from "@/lib/storage";

const key = (ids: string[]) => [...ids].sort().join("|");

/**
 * Håller sparade upphandlingar i synk med kontot. Vid inloggning slås det som
 * finns på enheten ihop med det som finns på kontot (inget tas bort), därefter
 * skickas ändringar upp efter en kort paus. Renderar ingenting.
 */
export default function AccountSync() {
  const { account } = useAccount();
  const { data: profile, isSuccess } = useProfile(account !== null);
  const queryClient = useQueryClient();
  const syncedFor = useRef<string | null>(null);
  const lastPushed = useRef<string>("");

  useEffect(() => {
    if (!account || !isSuccess) {
      if (!account) syncedFor.current = null;
      return;
    }
    const push = (saved: string[]) => {
      const base = queryClient.getQueryData<AccountProfile | null>(PROFILE_KEY) ?? emptyProfile;
      lastPushed.current = key(saved);
      saveProfile({ ...base, saved })
        .then((stored) => queryClient.setQueryData(PROFILE_KEY, stored))
        .catch(() => {
          lastPushed.current = ""; // försök igen vid nästa ändring
        });
    };

    if (syncedFor.current !== account.email) {
      syncedFor.current = account.email;
      const local = getSavedIds().filter(isSyncableId);
      const remote = profile?.saved ?? [];
      const merged = [...new Set([...remote, ...local])].slice(0, 500);
      lastPushed.current = key(remote);
      if (key(merged) !== key(getSavedIds())) setSavedIds(merged);
      if (key(merged) !== key(remote)) push(merged);
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = subscribeStorage(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const saved = getSavedIds().filter(isSyncableId).slice(0, 500);
        if (key(saved) !== lastPushed.current) push(saved);
      }, 1500);
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [account, isSuccess, profile, queryClient]);

  return null;
}
