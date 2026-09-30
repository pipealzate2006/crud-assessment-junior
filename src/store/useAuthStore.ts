import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: string | null
  login: (user: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: (user, password) => {
        if (user === 'admin' && password === '1234') {
          set({ user })
          return true
        }
        return false
      },

      logout: () => set({ user: null }),
    }),
    { name: 'sesion' },
  ),
)
