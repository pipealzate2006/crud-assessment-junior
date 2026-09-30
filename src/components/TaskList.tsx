import { useEffect } from 'react'
import type { Filter } from '../types'
import { useTaskStore } from '../store/useTaskStore'
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
      <div className="task-list__toolbar">
        <select
          className="task-list__filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
        >
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="done">Completadas</option>
        </select>
        <span className="task-list__count">
          {doneCount}/{tasks.length} completadas
        </span>
      </div>

      {error && <p className="task-list__error">{error}</p>}

      {loading ? (
        <p className="task-list__empty">Cargando tareas...</p>
      ) : visibleTasks.length === 0 ? (
        <p className="task-list__empty">No hay tareas para mostrar.</p>
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
