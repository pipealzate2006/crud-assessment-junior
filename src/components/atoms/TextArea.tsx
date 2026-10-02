import type { TextareaHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx('input', 'input--multiline', className)} {...props} />
}

export default TextArea
