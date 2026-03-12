import classes from './SliderNav.module.scss'
import clsx from 'clsx'
import { ReactNode } from 'react'
import ChevronLeft from '@icons/chevron-left.svg?react'
import ChevronRight from '@icons/chevron-right.svg?react'

interface SliderNavProps {
  prevId: string
  nextId: string
  className?: string
  theme?: 'light' | 'dark'
  children?: ReactNode
}

function SliderNav({theme = 'dark', prevId, nextId, className, children}: SliderNavProps) {
  return (
    <div className={clsx(classes.Navigation, (theme === 'light') && classes.Light, className)}>
      <button
        id={prevId}
        className={classes.Prev}
      >
         <ChevronLeft
              width={20}
              height={20}
          />
      </button>
      {children}
      <button
        id={nextId}
        className={classes.Next}
      >
         <ChevronRight
              width={20}
              height={20}
          />
      </button>
    </div>
  )
}

export default SliderNav