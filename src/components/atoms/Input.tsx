import type { InputHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

function Input({ hasError = false, className, ...props }: Props) {
  return (
    <input
      className={cx('input', hasError && 'input--error', className)}
      aria-invalid={hasError || undefined}
      {...props}
    />
  )
}

export default Input
