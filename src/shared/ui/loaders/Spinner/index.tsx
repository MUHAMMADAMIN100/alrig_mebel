import classes from './spinner.module.scss'
import { HTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string
  size?: number
  borderWidth?: number
  color?: string
}

function Spinner({className, borderWidth = 9, size = 56, color = '#FE7100'}: Props) {
  return (
    <>
      <span
        className={clsx(classes.spinner, className)}
      />
      <style>
        {`
          .${classes.spinner} {
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(farthest-side,${color} 94%,#0000) top/${borderWidth}px ${borderWidth}px no-repeat,
            conic-gradient(#0000 30%,${color});
            -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - ${borderWidth}px),#000 0);
            animation: spinner-c7wet2 1s infinite linear;
          }
    
          @keyframes spinner-c7wet2 {
            100% {
              transform: rotate(1turn);
            }
          }
        `}
      </style>
    </>
  )
}

export { Spinner }