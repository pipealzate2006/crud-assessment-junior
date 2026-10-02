import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../store/useAuthStore'
import { fakeServer } from './fakeServer'
import { http } from './http'
import { setupInterceptors } from './interceptors'

vi.mock('./fakeServer')

function loginAs(expiresAt = Date.now() + 60_000) {
  useAuthStore.setState({ user: 'admin', token: 'token-123', expiresAt, notice: null })
}

describe('interceptores de axios', () => {
  beforeAll(() => setupInterceptors())

  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.getState().logout()
    vi.mocked(fakeServer).mockResolvedValue({ status: 200, data: [] })
  })

  it('agrega el token de sesión en el header Authorization', async () => {
    loginAs()

    await http.get('/tasks')

    expect(fakeServer).toHaveBeenCalledWith(expect.objectContaining({ authorization: 'Bearer token-123' }))
  })

  it('no envía Authorization si no hay sesión', async () => {
    await http.get('/tasks')

    expect(fakeServer).toHaveBeenCalledWith(expect.objectContaining({ authorization: undefined }))
  })

  it('cancela la petición y cierra sesión si el token ya venció', async () => {
    loginAs(Date.now() - 1000)

    await expect(http.get('/tasks')).rejects.toThrow('Tu sesión expiró')

    expect(fakeServer).not.toHaveBeenCalled()
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().notice).toMatch('Tu sesión expiró')
  })

  it('cierra sesión cuando el servidor responde 401', async () => {
    loginAs()
    vi.mocked(fakeServer).mockResolvedValue({ status: 401, data: { message: 'Token inválido' } })

    await expect(http.get('/tasks')).rejects.toThrow('Token inválido')

    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().notice).toBe('Token inválido')
  })

  it('mantiene la sesión ante otros errores y devuelve el mensaje del servidor', async () => {
    loginAs()
    vi.mocked(fakeServer).mockResolvedValue({ status: 404, data: { message: 'La tarea no existe' } })

    await expect(http.delete('/tasks/x')).rejects.toThrow('La tarea no existe')

    expect(useAuthStore.getState().token).toBe('token-123')
  })
})
