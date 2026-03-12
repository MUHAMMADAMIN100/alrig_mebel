import classes from './Divider.module.scss'
import { Fragment, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Wrapper } from '../Wrapper'

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  withWrapper?: boolean
}

export const Divider = ({className, withWrapper = false, ...props}: DividerProps) => {
  const Tag = withWrapper ? Wrapper : Fragment

  return (
    <Tag>
      <div className={clsx(classes.Divider, className)} {...props}/>
    </Tag>
  )
}

