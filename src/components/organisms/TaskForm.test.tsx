import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as taskApi from '../../api/taskApi'
import { useTaskStore } from '../../store/useTaskStore'
import { makeTask, resetTaskStore } from '../../test/fixtures'
import TaskForm from './TaskForm'

vi.mock('../../api/taskApi')

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetTaskStore()
  })

  it('no envía el formulario si el título está vacío', async () => {
    render(<TaskForm />)

    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(screen.getByLabelText('Título')).toHaveAttribute('aria-invalid', 'true')
    expect(taskApi.createTask).not.toHaveBeenCalled()
  })

  it('quita el error al escribir en el título', async () => {
    render(<TaskForm />)

    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }))
    await userEvent.type(screen.getByLabelText('Título'), 'A')

    expect(screen.getByLabelText('Título')).not.toHaveAttribute('aria-invalid')
  })

  it('crea una tarea con los datos limpios y vacía el formulario', async () => {
    const created = makeTask({ title: 'Nueva', description: 'Algo', priority: 'high' })
    vi.mocked(taskApi.createTask).mockResolvedValue(created)

    render(<TaskForm />)
    await userEvent.type(screen.getByLabelText('Título'), '  Nueva  ')
    await userEvent.type(screen.getByLabelText('Descripción'), 'Algo')
    await userEvent.selectOptions(screen.getByLabelText('Prioridad'), 'high')
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(taskApi.createTask).toHaveBeenCalledWith({ title: 'Nueva', description: 'Algo', priority: 'high' })
    expect(useTaskStore.getState().tasks).toEqual([created])
    expect(screen.getByLabelText('Título')).toHaveValue('')
    expect(screen.getByLabelText('Prioridad')).toHaveValue('medium')
  })

  it('carga los datos de la tarea en modo edición y la actualiza', async () => {
    const task = makeTask({ priority: 'low' })
    useTaskStore.setState({ tasks: [task] })
    vi.mocked(taskApi.updateTask).mockResolvedValue({ ...task, title: 'Estudiar BEM' })

    render(<TaskForm />)
    act(() => useTaskStore.getState().setEditing(task))

    expect(screen.getByRole('heading', { name: 'Editar tarea' })).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toHaveValue('Estudiar Sass')
    expect(screen.getByLabelText('Prioridad')).toHaveValue('low')

    await userEvent.clear(screen.getByLabelText('Título'))
    await userEvent.type(screen.getByLabelText('Título'), 'Estudiar BEM')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(taskApi.updateTask).toHaveBeenCalledWith(task.id, {
      title: 'Estudiar BEM',
      description: 'Repasar mixins',
      priority: 'low',
    })
    expect(useTaskStore.getState().tasks[0].title).toBe('Estudiar BEM')
    expect(useTaskStore.getState().editing).toBeNull()
  })

  it('cancela la edición y vuelve al modo crear', async () => {
    render(<TaskForm />)
    act(() => useTaskStore.getState().setEditing(makeTask()))

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByRole('heading', { name: 'Nueva tarea' })).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toHaveValue('')
  })

  it('muestra "Guardando..." mientras se guarda', () => {
    useTaskStore.setState({ saving: true })
    render(<TaskForm />)

    expect(screen.getByRole('button', { name: 'Guardando...' })).toBeDisabled()
  })
})
