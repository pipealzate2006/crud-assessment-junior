import { create } from 'zustand'
import type { Filter, Task, TaskData } from '../types'
import * as taskApi from '../api/taskApi'

interface TaskState {
  tasks: Task[]
  editing: Task | null
  filter: Filter
  loading: boolean
  saving: boolean
  error: string | null
  loadTasks: () => Promise<void>
  addTask: (data: TaskData) => Promise<void>
  updateTask: (id: string, data: TaskData) => Promise<void>
  toggleTask: (task: Task) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setEditing: (task: Task | null) => void
  setFilter: (filter: Filter) => void
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Ocurrió un error'
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  editing: null,
  filter: 'all',
  loading: false,
  saving: false,
  error: null,

  loadTasks: async () => {
    set({ loading: true, error: null })
    try {
      const tasks = await taskApi.getTasks()
      set({ tasks })
    } catch (error) {
      set({ error: getMessage(error) })
    } finally {
      set({ loading: false })
    }
  },

  addTask: async (data) => {
    set({ saving: true, error: null })
    try {
      const task = await taskApi.createTask(data)
      set({ tasks: [task, ...get().tasks] })
    } catch (error) {
      set({ error: getMessage(error) })
    } finally {
      set({ saving: false })
    }
  },

  updateTask: async (id, data) => {
    set({ saving: true, error: null })
    try {
      const updated = await taskApi.updateTask(id, data)
      set({
        tasks: get().tasks.map((t) => (t.id === id ? updated : t)),
        editing: null,
      })
    } catch (error) {
      set({ error: getMessage(error) })
    } finally {
      set({ saving: false })
    }
  },

  toggleTask: async (task) => {
    set({ saving: true, error: null })
    try {
      const updated = await taskApi.updateTask(task.id, { done: !task.done })
      set({ tasks: get().tasks.map((t) => (t.id === task.id ? updated : t)) })
    } catch (error) {
      set({ error: getMessage(error) })
    } finally {
      set({ saving: false })
    }
  },

  deleteTask: async (id) => {
    set({ saving: true, error: null })
    try {
      await taskApi.deleteTask(id)
      set({
        tasks: get().tasks.filter((t) => t.id !== id),
        editing: get().editing?.id === id ? null : get().editing,
      })
    } catch (error) {
      set({ error: getMessage(error) })
    } finally {
      set({ saving: false })
    }
  },

  setEditing: (task) => set({ editing: task }),

  setFilter: (filter) => set({ filter }),
}))
