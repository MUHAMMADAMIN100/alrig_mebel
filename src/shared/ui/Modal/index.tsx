'use client'
import classes from './modal.module.scss'
import { ReactNode } from 'react'
// import { HandySvg } from 'handy-svg'
import {  useTransition } from '@react-spring/web'
import { animated } from '@react-spring/web'
import { useWindowSize } from 'usehooks-ts'
import clsx from 'clsx'
import { Portal } from '../Portal'

interface Props {
  isOpen: boolean
  children: ReactNode
  isShowCloseButton?: boolean
  contentClassName?: string
  mainClassName?: string

  close(): void
}

function Modal({ isOpen, close, children, mainClassName, isShowCloseButton = true, contentClassName }: Props) {
  const { width } = useWindowSize()
  const isMobile = width <= 768
  const backdropTransition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0, delay: 100 },
    config: { duration: 120 }
  })

  const mainTransition = useTransition(isOpen, {
    from: {
      opacity: 0,
      y: isMobile ? 0 : 100,
      x: isMobile ? 200 : 0,
    },
    enter: { opacity: 1, y: 0, delay: 50, x: 0 },
    leave: { opacity: 0, y: isMobile ? 0 : 100, x: isMobile ? 200 : 0 },
  })

  return (
    <Portal isOpen={true} rootId="modal-root">
      {backdropTransition((style, isOpen) => isOpen && (
        <div className={classes.modal}>
          <animated.div
            className={classes.backdrop}
            onClick={close}
            style={style}
          />

          {mainTransition((style, isOpen) => isOpen && (
            <animated.div
              className={clsx(classes.content, contentClassName)}
              style={style}
            >
              <div className={clsx(classes.main, mainClassName)}>
                {isShowCloseButton && <button
                  className={classes.close}
                  onClick={close}
                >
                  <img
                    src="/assets/icons/close.svg"
                    width={24}
                    height={24}
                  />
                </button>}
                {children}
              </div>
            </animated.div>
          ))}
        </div>
      ))}
    </Portal>
  )
}

export { Modal }


