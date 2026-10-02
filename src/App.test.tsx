import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { setupInterceptors } from './api/interceptors'
import App from './App'
import { useAuthStore } from './store/useAuthStore'
import { resetTaskStore } from './test/fixtures'

const TIMEOUT = { timeout: 3000 }

async function login(user: string, password: string) {
  await userEvent.type(screen.getByLabelText('Usuario'), user)
  await userEvent.type(screen.getByLabelText('Contraseña'), password)
  await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
}

describe('flujo completo de la app (integración)', () => {
  beforeAll(() => setupInterceptors())

  beforeEach(() => {
    window.history.pushState({}, '', '/')
    useAuthStore.getState().logout()
    resetTaskStore()
  })

  it('redirige al login si no hay sesión', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('muestra el error del servidor con credenciales incorrectas', async () => {
    render(<App />)

    await login('admin', 'mala')

    expect(await screen.findByText('Usuario o contraseña incorrectos', {}, TIMEOUT)).toBeInTheDocument()
    expect(useAuthStore.getState().token).toBeNull()
  })

  it('inicia sesión, guarda el token en sessionStorage y crea una tarea', async () => {
    render(<App />)

    await login('admin', '1234')

    expect(await screen.findByText('Hola, admin', {}, TIMEOUT)).toBeInTheDocument()
    expect(sessionStorage.getItem('sesion')).toContain('token')
    expect(sessionStorage.getItem('sesion')).not.toContain('1234')
    expect(await screen.findByText('No hay tareas para mostrar.', {}, TIMEOUT)).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Título'), 'Probar la app')
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(await screen.findByText('Probar la app', {}, TIMEOUT)).toBeInTheDocument()
    expect(screen.getByText('0/1 completadas')).toBeInTheDocument()
  }, 10000)

  it('vuelve al login con un aviso cuando el token es inválido', async () => {
    useAuthStore.setState({ user: 'admin', token: 'token-falso', expiresAt: Date.now() + 60_000 })

    render(<App />)

    expect(await screen.findByText('Tu sesión expiró, vuelve a iniciar sesión', {}, TIMEOUT)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('cierra sesión al pulsar "Cerrar sesión"', async () => {
    useAuthStore.setState({ user: 'admin', token: 'token', expiresAt: Date.now() + 60_000 })
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(useAuthStore.getState().token).toBeNull()
  })
})
