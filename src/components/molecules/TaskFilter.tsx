import { filterNames } from '../../constants'
import type { Filter } from '../../types'
import { Select } from '../atoms'

interface Props {
  value: Filter
  onChange: (filter: Filter) => void
  done: number
  total: number
}

function TaskFilter({ value, onChange, done, total }: Props) {
  return (
    <div className="task-filter">
      <Select
        aria-label="Filtrar tareas"
        className="task-filter__select"
        options={filterNames}
        value={value}
        onChange={(e) => onChange(e.target.value as Filter)}
      />
      <span className="task-filter__count">
        {done}/{total} completadas
      </span>
    </div>
  )
}

export default TaskFilter
