import type { Task } from '../types'
import { useTaskStore } from '../store/useTaskStore'

export function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: crypto.randomUUID(),
    title: 'Estudiar Sass',
    description: 'Repasar mixins',
    priority: 'medium',
    done: false,
    createdAt: '2026-01-15T12:00:00.000Z',
    ...overrides,
  }
}

export function resetTaskStore() {
  useTaskStore.setState({
    tasks: [],
    editing: null,
    filter: 'all',
    loading: false,
    saving: false,
    error: null,
  })
}
