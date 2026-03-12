import { HTMLAttributes } from 'react'
import clsx from 'clsx'
import classes from './alert.module.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  type: 'success' | 'danger' | 'attention' | 'info'
}

function Alert({ className, children, type, ...props }: Props) {
  return (
    <div
      className={clsx(classes.alert, classes[type], className)}
      {...props}
    >
      <img
        className={classes.icon}
        src={`/assets/icons/alerts/${type}.svg`}
        width={20}
        height={20}
      />
      <p className={classes.text}>{children}</p>
    </div>
  )
}

export { Alert }
