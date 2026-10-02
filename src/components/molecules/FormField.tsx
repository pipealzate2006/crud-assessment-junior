import type { ReactNode } from 'react'

interface Props {
  id: string
  label: string
  children: ReactNode
}

function FormField({ id, label, children }: Props) {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default FormField
