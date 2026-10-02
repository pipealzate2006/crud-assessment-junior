import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('usa la variante primary y type="button" por defecto', () => {
    render(<Button>Guardar</Button>)

    const button = screen.getByRole('button', { name: 'Guardar' })
    expect(button).toHaveClass('button', 'button--primary')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('aplica la variante y el tamaño pequeño', () => {
    render(<Button variant="danger" small>Eliminar</Button>)

    expect(screen.getByRole('button')).toHaveClass('button--danger', 'button--small')
  })

  it('ejecuta onClick y no lo hace si está deshabilitado', async () => {
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>Ok</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(<Button onClick={onClick} disabled>Ok</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
