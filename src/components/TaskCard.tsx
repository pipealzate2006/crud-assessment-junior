import type { Task } from '../types'
import { useTaskStore } from '../store/useTaskStore'

const priorityNames = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

interface Props {
  task: Task
}

function TaskCard({ task }: Props) {
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const setEditing = useTaskStore((state) => state.setEditing)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  function handleDelete() {
    if (confirm(`¿Eliminar "${task.title}"?`)) {
      deleteTask(task.id)
    }
  }

  let className = `task-card task-card--${task.priority}`
  if (task.done) className += ' task-card--done'

  return (
    <li className={className}>
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <span className="task-card__badge">{priorityNames[task.priority]}</span>
      </div>

      <p className="task-card__description">{task.description || 'Sin descripción'}</p>

      <div className="task-card__footer">
        <span className="task-card__date">
          {new Date(task.createdAt).toLocaleDateString('es-CO')}
        </span>
        <div className="task-card__actions">
          <button className="button button--success button--small" onClick={() => toggleTask(task.id)}>
            {task.done ? 'Reabrir' : 'Completar'}
          </button>
          <button className="button button--primary button--small" onClick={() => setEditing(task)}>
            Editar
          </button>
          <button className="button button--danger button--small" onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </li>
  )
}

export default TaskCard
