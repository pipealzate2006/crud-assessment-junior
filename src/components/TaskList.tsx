import type { Filter, Task } from '../types'
import TaskCard from './TaskCard'

interface Props {
  tasks: Task[]
  filter: Filter
  counter: string
  onFilterChange: (filter: Filter) => void
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

function TaskList({ tasks, filter, counter, onFilterChange, onToggle, onEdit, onDelete }: Props) {
  return (
    <section className="task-list">
      <div className="task-list__toolbar">
        <select
          className="task-list__filter"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as Filter)}
        >
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="done">Completadas</option>
        </select>
        <span className="task-list__count">{counter}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="task-list__empty">No hay tareas para mostrar.</p>
      ) : (
        <ul className="task-list__items">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default TaskList
