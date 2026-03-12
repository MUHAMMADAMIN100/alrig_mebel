import classes from './wrapper.module.scss'
import { AllHTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends AllHTMLAttributes<HTMLElement> {
  tag?: 'div' | 'section'
  className?: string
}

function Wrapper({tag: Tag = 'div', className, children, ...props}: Props) {

  return (
    <Tag
      className={clsx(classes.wrapper, className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

export { Wrapper }