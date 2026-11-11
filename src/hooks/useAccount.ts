import { useQuery } from "@tanstack/react-query";
import { fetchAccount, fetchProfile, type Account, type AccountProfile } from "@/lib/account";

export const ACCOUNT_KEY = ["account"] as const;
export const PROFILE_KEY = ["account", "profile"] as const;

/** Inloggat konto, eller null. Utan konto-API (t.ex. lokalt) räknas besökaren som utloggad. */
export function useAccount() {
  const query = useQuery<Account | null>({
    queryKey: ACCOUNT_KEY,
    queryFn: () => fetchAccount().catch(() => null),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return { account: query.data ?? null, loading: query.isPending };
}

export function useProfile(enabled: boolean) {
  return useQuery<AccountProfile | null>({
    queryKey: PROFILE_KEY,
    queryFn: fetchProfile,
    enabled,
    staleTime: 60 * 1000,
    retry: false,
  });
}
