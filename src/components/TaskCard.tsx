import type { Task } from '../types'

const priorityNames = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

interface Props {
  task: Task
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
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
          <button className="button button--success button--small" onClick={() => onToggle(task)}>
            {task.done ? 'Reabrir' : 'Completar'}
          </button>
          <button className="button button--primary button--small" onClick={() => onEdit(task)}>
            Editar
          </button>
          <button className="button button--danger button--small" onClick={() => onDelete(task)}>
            Eliminar
          </button>
        </div>
      </div>
    </li>
  )
}

export default TaskCard
