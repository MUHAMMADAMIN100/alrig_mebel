import classes from './bar-loader.module.scss'
import { HTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends HTMLAttributes<HTMLDivElement> {
  width?: number
  height?: number
  size?: number
  color?: string
}

function BarLoader({width = 50.4, height = 44.8, color = '#fff', className, size = 10.1, ...props}: Props) {
  return (
    <>
      <span
        className={clsx(classes.bars, className)}
        {...props}
      />
      <style>
        {`
          .${classes.bars} {
            width: ${width}px;
            height: ${height}px;
            --c: linear-gradient(${color} 0 0);
            background: var(--c) 0%   50%,
            var(--c) 50%  50%,
            var(--c) 100% 50%;
            background-size: ${size}px 100%;
            background-repeat: no-repeat;
            animation: bars-t0lx83md 0.8s infinite linear;
          }
    
          @keyframes bars-t0lx83md {
            33% {
              background-size: ${size}px 10%, ${size}px 100%, ${size}px 100%;
            }
            50% {
              background-size: ${size}px 100%, ${size}px 10%, ${size}px 100%;
            }
            66% {
              background-size: ${size}px 100%, ${size}px 100%, ${size}px 10%;
            }
          }
        `}
      </style>
    </>
  )
}

export { BarLoader }