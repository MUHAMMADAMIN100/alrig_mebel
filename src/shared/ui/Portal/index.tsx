'use client'
import { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useIsMounted } from 'usehooks-ts'

interface Props {
  isOpen: boolean
  children: ReactNode
  rootId: string
}

function Portal({children, isOpen, rootId}: Props) {
  const modalRoot = typeof window !== 'undefined'
    ? document.getElementById(rootId)
    : null
  const isMounted = useIsMounted()

  if (!isOpen) {
    return null
  }

  return isMounted() ? createPortal(children, modalRoot!) : null
}

export { Portal }