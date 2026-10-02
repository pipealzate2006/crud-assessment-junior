import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import * as authApi from '../api/authApi'

interface AuthState {
  user: string | null
  token: string | null
  expiresAt: number | null
  notice: string | null
  login: (user: string, password: string) => Promise<void>
  logout: (notice?: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      expiresAt: null,
      notice: null,

      login: async (user, password) => {
        const session = await authApi.login(user, password)
        set({ ...session, notice: null })
      },

      logout: (notice) => set({ user: null, token: null, expiresAt: null, notice: notice ?? null }),
    }),
    {
      name: 'sesion',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ user, token, expiresAt }) => ({ user, token, expiresAt }),
    },
  ),
)
