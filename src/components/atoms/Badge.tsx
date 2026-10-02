import type { ReactNode } from 'react'
import type { Priority } from '../../types'

interface Props {
  tone: Priority
  children: ReactNode
}

function Badge({ tone, children }: Props) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export default Badge
