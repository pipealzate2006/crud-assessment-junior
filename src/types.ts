export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  done: boolean
  createdAt: string
}

export interface TaskData {
  title: string
  description: string
  priority: Priority
}

export type Filter = 'all' | 'pending' | 'done'
