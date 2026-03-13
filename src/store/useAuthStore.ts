import { create } from 'zustand';

const STORAGE_KEY = 'auth-token';

function loadToken(): string | null {
  return sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY);
}

interface AuthState {
  token: string | null;
  setToken: (token: string, remember: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: loadToken(),
  setToken: (token, remember) => {
    if (remember) {
      localStorage.setItem(STORAGE_KEY, token);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, token);
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    set({ token: null });
  },
}));
