const SAVED_KEY = "kommunradar.saved";
const PROFILES_KEY = "kommunradar.profiles";
const SETTINGS_KEY = "kommunradar.settings";
const EVENT = "kommunradar-storage";

export interface WatchProfile {
  id: string;
  name: string;
  categories: string[];
  regions: string[];
  minValue: number;
  keywords: string[];
  active: boolean;
  createdAt: string;
}

export interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  notes: string;
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  defaultRegion: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    weekly: boolean;
    daily: boolean;
    instant: boolean;
  };
}

export const defaultSettings: UserSettings = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  role: "sales",
  notes: "",
  language: "sv",
  currency: "sek",
  timezone: "cet",
  dateFormat: "yyyy-mm-dd",
  defaultRegion: "all",
  notifications: {
    email: true,
    push: true,
    sms: false,
    weekly: true,
    daily: false,
    instant: true,
  },
};

function emit() {
  window.dispatchEvent(new Event(EVENT));
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// useSyncExternalStore kräver en stabil snapshot: samma array-referens så länge
// lagrat värde är oförändrat (annars oändlig render-loop, React-fel #185).
let savedRaw: string | null | undefined;
let savedSnapshot: string[] = [];

export function getSavedIds(): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(SAVED_KEY);
  } catch {
    raw = null;
  }
  if (raw !== savedRaw) {
    savedRaw = raw;
    savedSnapshot = readJson<string[]>(SAVED_KEY, []);
  }
  return savedSnapshot;
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id);
}

export function toggleSaved(id: string): boolean {
  const current = new Set(getSavedIds());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  localStorage.setItem(SAVED_KEY, JSON.stringify([...current]));
  emit();
  return current.has(id);
}

export function removeSaved(id: string) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(getSavedIds().filter((item) => item !== id)));
  emit();
}

export function getProfiles(): WatchProfile[] {
  return readJson<WatchProfile[]>(PROFILES_KEY, []);
}

export function saveProfiles(profiles: WatchProfile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  emit();
}

export function getSettings(): UserSettings {
  return { ...defaultSettings, ...readJson<Partial<UserSettings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: UserSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  emit();
}

export function subscribeStorage(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EVENT, handler);
  };
}
