import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string | null
  setToken: (token: string, remember: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token, remember) => {
        const storage = remember ? localStorage : sessionStorage
        storage.setItem('auth-token', token)
        set({ token })
      },
      logout: () => {
        localStorage.removeItem('auth-token')
        sessionStorage.removeItem('auth-token')
        set({ token: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined' && sessionStorage.getItem('auth-token')) {
          return sessionStorage
        }
        return localStorage
      }),
    },
  ),
)
