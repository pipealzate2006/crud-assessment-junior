import { priorityNames } from '../../constants'
import { useTaskStore } from '../../store/useTaskStore'
import type { Task } from '../../types'
import { cx } from '../../utils/cx'
import { Badge, Button } from '../atoms'

interface Props {
  task: Task
}

function TaskCard({ task }: Props) {
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const setEditing = useTaskStore((state) => state.setEditing)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const saving = useTaskStore((state) => state.saving)

  async function handleDelete() {
    if (confirm(`¿Eliminar "${task.title}"?`)) {
      await deleteTask(task.id)
    }
  }

  return (
    <li className={cx('task-card', `task-card--${task.priority}`, task.done && 'task-card--done')}>
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <Badge tone={task.priority}>{priorityNames[task.priority]}</Badge>
      </div>

      <p className="task-card__description">{task.description || 'Sin descripción'}</p>

      <div className="task-card__footer">
        <span className="task-card__date">
          {new Date(task.createdAt).toLocaleDateString('es-CO')}
        </span>
        <div className="task-card__actions">
          <Button variant="success" small onClick={() => toggleTask(task)} disabled={saving}>
            {task.done ? 'Reabrir' : 'Completar'}
          </Button>
          <Button small onClick={() => setEditing(task)} disabled={saving}>
            Editar
          </Button>
          <Button variant="danger" small onClick={handleDelete} disabled={saving}>
            Eliminar
          </Button>
        </div>
      </div>
    </li>
  )
}

export default TaskCard
