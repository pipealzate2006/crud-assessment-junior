import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as taskApi from '../../api/taskApi'
import { makeTask, resetTaskStore } from '../../test/fixtures'
import TaskList from './TaskList'

vi.mock('../../api/taskApi')

const pending = makeTask({ title: 'Pendiente' })
const done = makeTask({ title: 'Terminada', done: true })

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetTaskStore()
  })

  it('muestra "Cargando" y luego las tareas del servicio', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue([pending, done])

    render(<TaskList />)

    expect(screen.getByText('Cargando tareas...')).toBeInTheDocument()
    expect(await screen.findByText('Pendiente')).toBeInTheDocument()
    expect(screen.getByText('Terminada')).toBeInTheDocument()
    expect(screen.getByText('1/2 completadas')).toBeInTheDocument()
  })

  it('filtra las tareas pendientes y completadas', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue([pending, done])
    render(<TaskList />)
    await screen.findByText('Pendiente')

    await userEvent.selectOptions(screen.getByRole('combobox'), 'pending')
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.queryByText('Terminada')).not.toBeInTheDocument()

    await userEvent.selectOptions(screen.getByRole('combobox'), 'done')
    expect(screen.queryByText('Pendiente')).not.toBeInTheDocument()
    expect(screen.getByText('Terminada')).toBeInTheDocument()
  })

  it('muestra un mensaje cuando no hay tareas', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue([])

    render(<TaskList />)

    expect(await screen.findByText('No hay tareas para mostrar.')).toBeInTheDocument()
  })

  it('muestra el error si el servicio falla', async () => {
    vi.mocked(taskApi.getTasks).mockRejectedValue(new Error('No se pudieron cargar las tareas'))

    render(<TaskList />)

    expect(await screen.findByText('No se pudieron cargar las tareas')).toBeInTheDocument()
  })
})
