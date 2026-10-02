import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as taskApi from '../../api/taskApi'
import { useTaskStore } from '../../store/useTaskStore'
import { makeTask, resetTaskStore } from '../../test/fixtures'
import TaskCard from './TaskCard'

vi.mock('../../api/taskApi')

describe('TaskCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetTaskStore()
  })

  it('muestra el título, la descripción y la prioridad de la tarea', () => {
    render(<TaskCard task={makeTask({ priority: 'high' })} />)

    expect(screen.getByRole('heading', { name: 'Estudiar Sass' })).toBeInTheDocument()
    expect(screen.getByText('Repasar mixins')).toBeInTheDocument()
    expect(screen.getByText('Alta')).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toHaveClass('task-card--high')
  })

  it('muestra un texto por defecto cuando no hay descripción', () => {
    render(<TaskCard task={makeTask({ description: '' })} />)

    expect(screen.getByText('Sin descripción')).toBeInTheDocument()
  })

  it('marca la tarea como completada', async () => {
    const task = makeTask()
    useTaskStore.setState({ tasks: [task] })
    vi.mocked(taskApi.updateTask).mockResolvedValue({ ...task, done: true })

    render(<TaskCard task={task} />)
    await userEvent.click(screen.getByRole('button', { name: 'Completar' }))

    expect(taskApi.updateTask).toHaveBeenCalledWith(task.id, { done: true })
    expect(useTaskStore.getState().tasks[0].done).toBe(true)
  })

  it('muestra "Reabrir" y el estilo de completada si la tarea está hecha', () => {
    render(<TaskCard task={makeTask({ done: true })} />)

    expect(screen.getByRole('button', { name: 'Reabrir' })).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toHaveClass('task-card--done')
  })

  it('pone la tarea en modo edición', async () => {
    const task = makeTask()
    render(<TaskCard task={task} />)

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }))

    expect(useTaskStore.getState().editing).toEqual(task)
  })

  it('elimina la tarea cuando el usuario confirma', async () => {
    const task = makeTask()
    useTaskStore.setState({ tasks: [task] })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.mocked(taskApi.deleteTask).mockResolvedValue()

    render(<TaskCard task={task} />)
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(taskApi.deleteTask).toHaveBeenCalledWith(task.id)
    expect(useTaskStore.getState().tasks).toHaveLength(0)
  })

  it('no elimina la tarea si el usuario cancela', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<TaskCard task={makeTask()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(taskApi.deleteTask).not.toHaveBeenCalled()
  })

  it('deshabilita las acciones mientras se guarda', () => {
    useTaskStore.setState({ saving: true })
    render(<TaskCard task={makeTask()} />)

    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled()
    }
  })
})
