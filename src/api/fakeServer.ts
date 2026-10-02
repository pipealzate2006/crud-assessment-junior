import type { Task } from '../types'

const DB_KEY = 'tareas-db'
const SESSION_MINUTES = 15

interface FakeRequest {
  method: string
  url: string
  authorization?: string
  body?: unknown
}

interface FakeResponse<T = unknown> {
  status: number
  data: T
}

interface TokenPayload {
  user: string
  exp: number
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readTasks(): Task[] {
  return JSON.parse(localStorage.getItem(DB_KEY) || '[]')
}

function writeTasks(tasks: Task[]) {
  localStorage.setItem(DB_KEY, JSON.stringify(tasks))
}

function reply<T>(status: number, data: T): FakeResponse<T> {
  return { status, data }
}

function createToken(user: string) {
  const payload: TokenPayload = { user, exp: Date.now() + SESSION_MINUTES * 60 * 1000 }
  return { token: btoa(JSON.stringify(payload)), expiresAt: payload.exp }
}

function verifyToken(header?: string): TokenPayload | null {
  if (!header?.startsWith('Bearer ')) return null

  try {
    const payload: TokenPayload = JSON.parse(atob(header.slice(7)))
    return payload.exp > Date.now() ? payload : null
  } catch {
    return null
  }
}

export async function fakeServer(request: FakeRequest): Promise<FakeResponse> {
  const { method, url, body, authorization } = request
  await delay(method === 'GET' ? 800 : 500)

  if (method === 'POST' && url === '/auth/login') {
    const { user, password } = body as { user: string; password: string }
    if (user === 'admin' && password === '1234') {
      return reply(200, { user, ...createToken(user) })
    }
    return reply(401, { message: 'Usuario o contraseña incorrectos' })
  }

  if (!verifyToken(authorization)) {
    return reply(401, { message: 'Tu sesión expiró, vuelve a iniciar sesión' })
  }

  const tasks = readTasks()
  const id = url.split('/')[2]

  if (method === 'GET' && url === '/tasks') {
    return reply(200, tasks)
  }

  if (method === 'POST' && url === '/tasks') {
    const task: Task = {
      id: crypto.randomUUID(),
      ...(body as Omit<Task, 'id' | 'done' | 'createdAt'>),
      done: false,
      createdAt: new Date().toISOString(),
    }
    writeTasks([task, ...tasks])
    return reply(201, task)
  }

  const task = tasks.find((t) => t.id === id)
  if (!task) {
    return reply(404, { message: 'La tarea no existe' })
  }

  if (method === 'PUT') {
    const updated = { ...task, ...(body as Partial<Task>) }
    writeTasks(tasks.map((t) => (t.id === id ? updated : t)))
    return reply(200, updated)
  }

  if (method === 'DELETE') {
    writeTasks(tasks.filter((t) => t.id !== id))
    return reply(204, null)
  }

  return reply(404, { message: 'Ruta no encontrada' })
}
