import { Idea, HistoryRecord } from '@/types';

const FAVORITES_KEY = 'khkt_favorites';
const HISTORY_KEY = 'khkt_history';

export function getFavorites(): Idea[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFavorite(idea: Idea) {
  const favorites = getFavorites();
  if (!favorites.some(f => f.id === idea.id)) {
    favorites.push(idea);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(ideaId: string) {
  const favorites = getFavorites().filter(f => f.id !== ideaId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorite(ideaId: string): boolean {
  return getFavorites().some(f => f.id === ideaId);
}

export function getHistory(): HistoryRecord[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHistory(record: HistoryRecord) {
  const history = getHistory();
  history.unshift(record);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function removeHistory(recordId: string) {
  const history = getHistory().filter(h => h.id !== recordId);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

// Authentication dummy
const AUTH_KEY = 'khkt_auth';
export function login(code: string): boolean {
  const validCode = import.meta.env.VITE_ACCESS_CODE || 'KHKT2026';
  if (code === validCode) {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}
