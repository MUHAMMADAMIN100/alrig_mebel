import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { Portal } from '../../shared/ui/Portal'
import { ICON_SIZE, ICON_STROKE } from '../lib/icons'
import { ORDER_STATUS_MAP, ORDER_STATUSES, OrderStatus, StatusTone } from '../lib/orderStatus'
import classes from './status.module.scss'

interface Props {
  value: OrderStatus
  onChange(value: OrderStatus): void
  disabled?: boolean
}

const DOT_CLASS: Record<StatusTone, string> = {
  blue: classes.dotBlue,
  amber: classes.dotAmber,
  green: classes.dotGreen,
  red: classes.dotRed,
}

const ACTIVE_CLASS: Record<StatusTone, string> = {
  blue: classes.activeBlue,
  amber: classes.activeAmber,
  green: classes.activeGreen,
  red: classes.activeRed,
}

export const StatusSelect = ({ value, onChange, disabled }: Props) => {
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const meta = ORDER_STATUS_MAP[value]

  const toggle = () => {
    if (disabled) return
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect())
    setOpen((prev) => !prev)
  }

  // закрытие по клику вне, Escape, скроллу и ресайзу (позиция fixed устаревает)
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  const select = (status: OrderStatus) => {
    setOpen(false)
    if (status !== value) onChange(status)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${classes.trigger} ${classes[meta.tone]}`}
        onClick={toggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={classes.dot} />
        {meta.label}
        <ChevronDown
          className={`${classes.chevron} ${open ? classes.chevronOpen : ''}`}
          size={ICON_SIZE.mini}
          strokeWidth={ICON_STROKE}
        />
      </button>

      <Portal isOpen={open} rootId="modal-root">
        <AnimatePresence>
          {open && rect && (
            <motion.div
              ref={menuRef}
              className={classes.menu}
              style={{ top: rect.bottom + 6, left: rect.left, minWidth: Math.max(rect.width, 184) }}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              role="listbox"
            >
              {ORDER_STATUSES.map((status) => {
                const isActive = status.value === value
                return (
                  <button
                    key={status.value}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`${classes.option} ${isActive ? ACTIVE_CLASS[status.tone] : ''}`}
                    onClick={() => select(status.value)}
                  >
                    <span className={`${classes.optionDot} ${DOT_CLASS[status.tone]}`} />
                    {status.label}
                    {isActive && (
                      <Check className={classes.check} size={ICON_SIZE.mini} strokeWidth={ICON_STROKE} />
                    )}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  )
}
