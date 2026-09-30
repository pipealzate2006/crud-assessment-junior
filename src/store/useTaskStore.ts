import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Filter, Task, TaskData } from '../types'

interface TaskState {
  tasks: Task[]
  editing: Task | null
  filter: Filter
  addTask: (data: TaskData) => void
  updateTask: (id: string, data: TaskData) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  setEditing: (task: Task | null) => void
  setFilter: (filter: Filter) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      editing: null,
      filter: 'all',

      addTask: (data) =>
        set((state) => ({
          tasks: [
            {
              id: crypto.randomUUID(),
              ...data,
              done: false,
              createdAt: new Date().toISOString(),
            },
            ...state.tasks,
          ],
        })),

      updateTask: (id, data) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
          editing: null,
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          editing: state.editing?.id === id ? null : state.editing,
        })),

      setEditing: (task) => set({ editing: task }),

      setFilter: (filter) => set({ filter }),
    }),
    {
      name: 'tareas',
      partialize: (state) => ({ tasks: state.tasks }),
    },
  ),
)
