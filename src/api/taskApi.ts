import type { Task, TaskData } from '../types'

const KEY = 'tareas-db'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readTasks(): Task[] {
  return JSON.parse(localStorage.getItem(KEY) || '[]')
}

function writeTasks(tasks: Task[]) {
  localStorage.setItem(KEY, JSON.stringify(tasks))
}

export function getTasks(): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(readTasks())
      } catch {
        reject(new Error('No se pudieron cargar las tareas'))
      }
    }, 800)
  })
}

export async function createTask(data: TaskData): Promise<Task> {
  await delay(500)

  const task: Task = {
    id: crypto.randomUUID(),
    ...data,
    done: false,
    createdAt: new Date().toISOString(),
  }
  writeTasks([task, ...readTasks()])
  return task
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  await delay(500)

  const tasks = readTasks()
  const task = tasks.find((t) => t.id === id)
  if (!task) {
    throw new Error('La tarea no existe')
  }

  const updated = { ...task, ...data }
  writeTasks(tasks.map((t) => (t.id === id ? updated : t)))
  return updated
}

export async function deleteTask(id: string): Promise<void> {
  await delay(500)

  const tasks = readTasks()
  if (!tasks.some((t) => t.id === id)) {
    throw new Error('La tarea no existe')
  }

  writeTasks(tasks.filter((t) => t.id !== id))
}
