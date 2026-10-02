import type { SelectHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Record<string, string>
}

function Select({ options, className, ...props }: Props) {
  return (
    <select className={cx('input', className)} {...props}>
      {Object.entries(options).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
}

export default Select
