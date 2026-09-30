import { useEffect, useState } from 'react'
import type { Priority } from '../types'
import { useTaskStore } from '../store/useTaskStore'

function TaskForm() {
  const editing = useTaskStore((state) => state.editing)
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const setEditing = useTaskStore((state) => state.setEditing)
  const saving = useTaskStore((state) => state.saving)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (editing) {
      setTitle(editing.title)
      setDescription(editing.description)
      setPriority(editing.priority)
    } else {
      clearForm()
    }
  }, [editing])

  function clearForm() {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setError(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (title.trim() === '') {
      setError(true)
      return
    }

    const data = {
      title: title.trim(),
      description: description.trim(),
      priority,
    }

    if (editing) {
      await updateTask(editing.id, data)
    } else {
      await addTask(data)
    }
    clearForm()
  }

  return (
    <form
      className={editing ? 'task-form task-form--editing' : 'task-form'}
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="task-form__title">{editing ? 'Editar tarea' : 'Nueva tarea'}</h2>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="title">Título</label>
        <input
          id="title"
          type="text"
          className={error ? 'task-form__input task-form__input--error' : 'task-form__input'}
          placeholder="Ej: Estudiar Sass"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setError(false)
          }}
        />
      </div>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="description">Descripción</label>
        <textarea
          id="description"
          className="task-form__input"
          rows={3}
          placeholder="Detalles opcionales"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="priority">Prioridad</label>
        <select
          id="priority"
          className="task-form__input"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div className="task-form__actions">
        {editing && (
          <button type="button" className="button button--ghost" onClick={() => setEditing(null)}>
            Cancelar
          </button>
        )}
        <button type="submit" className="button button--primary" disabled={saving}>
          {saving ? 'Guardando...' : editing ? 'Guardar' : 'Agregar'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
