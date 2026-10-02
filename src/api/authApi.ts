import { http } from './http'

export interface Session {
  user: string
  token: string
  expiresAt: number
}

export async function login(user: string, password: string) {
  const { data } = await http.post<Session>('/auth/login', { user, password })
  return data
}
