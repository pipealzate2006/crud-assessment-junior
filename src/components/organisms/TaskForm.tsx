import { useEffect, useState } from 'react'
import { priorityNames } from '../../constants'
import { useTaskStore } from '../../store/useTaskStore'
import type { Priority } from '../../types'
import { cx } from '../../utils/cx'
import { Button, Input, Select, TextArea } from '../atoms'
import { FormField } from '../molecules'

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
    <form className={cx('task-form', editing && 'task-form--editing')} onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__title">{editing ? 'Editar tarea' : 'Nueva tarea'}</h2>

      <FormField id="title" label="Título">
        <Input
          id="title"
          type="text"
          placeholder="Ej: Estudiar Sass"
          hasError={error}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setError(false)
          }}
        />
      </FormField>

      <FormField id="description" label="Descripción">
        <TextArea
          id="description"
          rows={3}
          placeholder="Detalles opcionales"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>

      <FormField id="priority" label="Prioridad">
        <Select
          id="priority"
          options={priorityNames}
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        />
      </FormField>

      <div className="task-form__actions">
        {editing && (
          <Button variant="ghost" onClick={() => setEditing(null)}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : editing ? 'Guardar' : 'Agregar'}
        </Button>
      </div>
    </form>
  )
}

export default TaskForm
