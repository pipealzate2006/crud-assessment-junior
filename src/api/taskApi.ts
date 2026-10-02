import type { Task, TaskData } from '../types'
import { http } from './http'

export async function getTasks() {
  const { data } = await http.get<Task[]>('/tasks')
  return data
}

export async function createTask(task: TaskData) {
  const { data } = await http.post<Task>('/tasks', task)
  return data
}

export async function updateTask(id: string, changes: Partial<Task>) {
  const { data } = await http.put<Task>(`/tasks/${id}`, changes)
  return data
}

export async function deleteTask(id: string) {
  await http.delete(`/tasks/${id}`)
}
