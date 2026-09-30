import type { Task } from './types'

const KEY = 'tareas'

export function getTasks(): Task[] {
  const data = localStorage.getItem(KEY)
  if (!data) return []

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(KEY, JSON.stringify(tasks))
}
