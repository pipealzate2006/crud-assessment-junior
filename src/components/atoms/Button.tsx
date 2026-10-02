import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export type ButtonVariant = 'primary' | 'danger' | 'success' | 'ghost'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  small?: boolean
}

function Button({ variant = 'primary', small = false, type = 'button', className, ...props }: Props) {
  return (
    <button
      type={type}
      className={cx('button', `button--${variant}`, small && 'button--small', className)}
      {...props}
    />
  )
}

export default Button
