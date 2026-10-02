import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TaskFilter from './TaskFilter'

describe('TaskFilter', () => {
  it('muestra el contador de tareas completadas', () => {
    render(<TaskFilter value="all" onChange={() => {}} done={2} total={5} />)

    expect(screen.getByText('2/5 completadas')).toBeInTheDocument()
  })

  it('avisa el filtro elegido', async () => {
    const onChange = vi.fn()
    render(<TaskFilter value="all" onChange={onChange} done={0} total={0} />)

    await userEvent.selectOptions(screen.getByLabelText('Filtrar tareas'), 'done')

    expect(onChange).toHaveBeenCalledWith('done')
  })
})
