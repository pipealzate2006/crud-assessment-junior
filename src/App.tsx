import { useEffect, useState } from 'react'
import type { Filter, Task, TaskData } from './types'
import { getTasks, saveTasks } from './storage'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

function App() {
  const [tasks, setTasks] = useState<Task[]>(getTasks)
  const [editing, setEditing] = useState<Task | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  function addTask(data: TaskData) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...data,
      done: false,
      createdAt: new Date().toISOString(),
    }
    setTasks([newTask, ...tasks])
  }

  function updateTask(id: string, data: Partial<Task>) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...data } : t)))
  }

  function deleteTask(task: Task) {
    if (!confirm(`¿Eliminar "${task.title}"?`)) return
    setTasks(tasks.filter((t) => t.id !== task.id))
    if (editing?.id === task.id) setEditing(null)
  }

  function handleSubmit(data: TaskData) {
    if (editing) {
      updateTask(editing.id, data)
      setEditing(null)
    } else {
      addTask(data)
    }
  }

  const visibleTasks = tasks.filter((t) => {
    if (filter === 'done') return t.done
    if (filter === 'pending') return !t.done
    return true
  })

  const doneCount = tasks.filter((t) => t.done).length

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Gestor de tareas</h1>
        <p className="app__subtitle">React + Sass + BEM + localStorage</p>
      </header>

      <main className="app__main">
        <TaskForm
          editing={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />

        <TaskList
          tasks={visibleTasks}
          filter={filter}
          counter={`${doneCount}/${tasks.length} completadas`}
          onFilterChange={setFilter}
          onToggle={(task) => updateTask(task.id, { done: !task.done })}
          onEdit={setEditing}
          onDelete={deleteTask}
        />
      </main>
    </div>
  )
}

export default App
