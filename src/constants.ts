import type { Filter, Priority } from './types'

export const priorityNames: Record<Priority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

export const filterNames: Record<Filter, string> = {
  all: 'Todas',
  pending: 'Pendientes',
  done: 'Completadas',
}
