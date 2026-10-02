import { useEffect } from 'react'
import { useTaskStore } from '../../store/useTaskStore'
import { Alert, EmptyState } from '../atoms'
import { TaskFilter } from '../molecules'
import TaskCard from './TaskCard'

function TaskList() {
  const tasks = useTaskStore((state) => state.tasks)
  const filter = useTaskStore((state) => state.filter)
  const setFilter = useTaskStore((state) => state.setFilter)
  const loading = useTaskStore((state) => state.loading)
  const error = useTaskStore((state) => state.error)
  const loadTasks = useTaskStore((state) => state.loadTasks)

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const visibleTasks = tasks.filter((t) => {
    if (filter === 'done') return t.done
    if (filter === 'pending') return !t.done
    return true
  })

  const doneCount = tasks.filter((t) => t.done).length

  return (
    <section className="task-list">
      <TaskFilter value={filter} onChange={setFilter} done={doneCount} total={tasks.length} />

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <EmptyState>Cargando tareas...</EmptyState>
      ) : visibleTasks.length === 0 ? (
        <EmptyState>No hay tareas para mostrar.</EmptyState>
      ) : (
        <ul className="task-list__items">
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default TaskList
