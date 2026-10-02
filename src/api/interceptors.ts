import { AxiosError } from 'axios'
import { useAuthStore } from '../store/useAuthStore'
import { http } from './http'

const SESSION_EXPIRED = 'Tu sesión expiró, vuelve a iniciar sesión'

export function setupInterceptors() {
  http.interceptors.request.use((config) => {
    const { token, expiresAt, logout } = useAuthStore.getState()

    if (token && expiresAt && expiresAt < Date.now()) {
      logout(SESSION_EXPIRED)
      throw new AxiosError(SESSION_EXPIRED, '401', config)
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (import.meta.env.DEV) {
      console.info(`[http] → ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  })

  http.interceptors.response.use(
    (response) => {
      if (import.meta.env.DEV) {
        console.info(`[http] ← ${response.status} ${response.config.url}`)
      }
      return response
    },
    (error: AxiosError<{ message?: string }>) => {
      const status = error.response?.status
      const message = error.response?.data?.message ?? error.message

      if (import.meta.env.DEV) {
        console.warn(`[http] ← ${status ?? 'sin respuesta'} ${message}`)
      }

      if (status === 401 && useAuthStore.getState().token) {
        useAuthStore.getState().logout(message)
      }

      return Promise.reject(new Error(message))
    },
  )
}
