import type { ReactNode } from 'react'

interface Props {
  variant?: 'error' | 'info'
  children: ReactNode
}

function Alert({ variant = 'error', children }: Props) {
  return (
    <p className={`alert alert--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}

export default Alert
