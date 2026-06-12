import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import { Portal } from '../Portal'
import classes from './confirm-modal.module.scss'

interface Props {
  isOpen: boolean
  title: string
  description?: string
  confirmLabel?: string
  isLoading?: boolean
  /** Текст ошибки (сервер / PROTECT) — показывается внутри модалки. */
  errorMessage?: string | null
  /** Заблокировать удаление (например, есть вложенные записи). */
  confirmDisabled?: boolean
  onConfirm(): void
  onCancel(): void
}

export const ConfirmModal = ({
  isOpen,
  title,
  description = 'Действие необратимо.',
  confirmLabel = 'Удалить',
  isLoading,
  errorMessage,
  confirmDisabled,
  onConfirm,
  onCancel,
}: Props) => {
  const titleId = useId()
  const [mounted, setMounted] = useState(isOpen)
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) setMounted(true)
  }, [isOpen])

  // фокус по умолчанию на «Отмена», закрытие по Esc, focus-trap
  useEffect(() => {
    if (!isOpen) return
    const focusTimer = window.setTimeout(() => cancelRef.current?.focus(), 0)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!isLoading) onCancel()
        return
      }
      if (event.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled])',
        )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, isLoading, onCancel])

  return (
    <Portal isOpen={mounted} rootId="modal-root">
      <AnimatePresence onExitComplete={() => setMounted(false)}>
        {isOpen && (
          <motion.div
            className={classes.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !isLoading) onCancel()
            }}
          >
            <motion.div
              ref={dialogRef}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className={classes.dialog}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <div className={classes.iconCircle}>
                <Trash2 size={22} strokeWidth={1.9} />
              </div>
              <h3 id={titleId} className={classes.title}>{title}</h3>
              <p className={classes.description}>{description}</p>

              {errorMessage && (
                <div className={classes.error} role="alert">
                  <AlertTriangle size={16} strokeWidth={2} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className={classes.actions}>
                <button
                  ref={cancelRef}
                  type="button"
                  className={classes.cancel}
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  className={classes.confirm}
                  onClick={onConfirm}
                  disabled={isLoading || confirmDisabled}
                >
                  {isLoading && <Loader2 className={classes.spinner} size={16} strokeWidth={2} />}
                  {isLoading ? 'Удаляем…' : confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
