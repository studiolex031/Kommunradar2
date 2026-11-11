/**
 * Anrop mot konto-API:t på login.kommunradar.online (PHP, se simply/api).
 * Sessionen ligger i en HttpOnly-cookie som webbläsaren skickar själv.
 */

export type Account = {
  email: string;
  createdAt: number;
  plan: "free" | "pro";
  /** false = betalstatus har aldrig kunnat kontrolleras mot Stripe */
  planVerified: boolean;
};

export type AccountProfile = {
  name: string;
  company: string;
  keywords: string[];
  county: string;
  saved: string[];
};

export const emptyProfile: AccountProfile = { name: "", company: "", keywords: [], county: "alla", saved: [] };

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function call<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: init?.method ?? "GET",
      credentials: "same-origin",
      headers: init?.body === undefined ? { "X-Kommunradar": "1" } : { "X-Kommunradar": "1", "Content-Type": "application/json" },
      body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    });
  } catch {
    throw new ApiError("Ingen kontakt med servern. Kontrollera uppkopplingen och försök igen.", 0);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload === null) {
    throw new ApiError(payload?.error ?? "Något gick fel. Försök igen om en stund.", response.status);
  }
  return payload as T;
}

export const fetchAccount = (refreshPlan = false) =>
  call<{ account: Account | null }>(refreshPlan ? "/api/me?uppdatera=1" : "/api/me").then((data) => data.account);

export const requestLoginCode = (email: string) => call<{ ok: true }>("/api/auth-request", { method: "POST", body: { email } });

export const verifyLoginCode = (email: string, code: string) =>
  call<{ account: Account }>("/api/auth-verify", { method: "POST", body: { email, code } }).then((data) => data.account);

export const logout = () => call<{ ok: true }>("/api/logout", { method: "POST", body: {} });

export const fetchProfile = () =>
  call<{ profile: AccountProfile | null; updatedAt: number }>("/api/profile").then((data) => data.profile);

export const saveProfile = (profile: AccountProfile) =>
  call<{ profile: AccountProfile }>("/api/profile", { method: "PUT", body: { profile } }).then((data) => data.profile);

/** Samma regel som servern: bara id:n som kan sparas. */
export const isSyncableId = (id: string) => /^[A-Za-z0-9_-]{1,80}$/.test(id);
