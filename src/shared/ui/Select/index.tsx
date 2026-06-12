import {
  KeyboardEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { Portal } from '../Portal'
import classes from './select.module.scss'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  value: string
  onChange(value: string): void
  options: readonly SelectOption[]
  placeholder?: string
  disabled?: boolean
  fullWidth?: boolean
  invalid?: boolean
  ariaLabel?: string
  className?: string
  id?: string
}

interface Coords {
  top: number
  left: number
  width: number
  maxHeight: number
  placement: 'bottom' | 'top'
}

const GAP = 6
const MARGIN = 8
const MAX_MENU_HEIGHT = 280

export const Select = ({
  value,
  onChange,
  options,
  placeholder = 'Выберите…',
  disabled,
  fullWidth,
  invalid,
  ariaLabel,
  className,
  id,
}: Props) => {
  const reactId = useId()
  const baseId = id ?? `select-${reactId}`
  const listId = `${baseId}-list`

  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<Coords | null>(null)
  const [highlight, setHighlight] = useState(-1)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const computeCoords = () => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const menuHeight = menuRef.current?.offsetHeight ?? Math.min(options.length * 40 + 12, MAX_MENU_HEIGHT)
    const spaceBelow = window.innerHeight - rect.bottom - MARGIN
    const spaceAbove = rect.top - MARGIN
    const placement: 'bottom' | 'top' =
      spaceBelow >= menuHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top'
    const maxHeight = Math.max(
      120,
      Math.min(MAX_MENU_HEIGHT, placement === 'bottom' ? spaceBelow : spaceAbove),
    )
    const width = rect.width
    let left = rect.left
    if (left + width > window.innerWidth - MARGIN) left = window.innerWidth - MARGIN - width
    if (left < MARGIN) left = MARGIN
    const top =
      placement === 'bottom'
        ? rect.bottom + GAP
        : rect.top - GAP - Math.min(menuHeight, maxHeight)
    setCoords({ top, left, width, maxHeight, placement })
  }

  const openMenu = () => {
    if (disabled) return
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0)
    computeCoords()
    setOpen(true)
  }

  const close = () => setOpen(false)

  // уточняем позицию после монтирования меню (реальная высота) — до отрисовки
  useLayoutEffect(() => {
    if (open) computeCoords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // подсвеченный пункт держим в зоне видимости при навигации с клавиатуры
  useEffect(() => {
    if (!open || highlight < 0) return
    document.getElementById(`${baseId}-opt-${highlight}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, highlight, baseId])

  // закрытие по клику вне / скроллу страницы / ресайзу
  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      close()
    }
    const onScroll = (event: Event) => {
      const target = event.target as Node | null
      if (target && menuRef.current?.contains(target)) return // скролл внутри списка не закрывает
      close()
    }
    const onResize = () => close()
    document.addEventListener('mousedown', onPointer)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const choose = (index: number) => {
    const option = options[index]
    if (!option) return
    close()
    if (option.value !== value) onChange(option.value)
    triggerRef.current?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        openMenu()
      }
      return
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'ArrowDown':
        event.preventDefault()
        setHighlight((current) => Math.min(options.length - 1, current + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setHighlight((current) => Math.max(0, current - 1))
        break
      case 'Home':
        event.preventDefault()
        setHighlight(0)
        break
      case 'End':
        event.preventDefault()
        setHighlight(options.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(highlight)
        break
      case 'Tab':
        close()
        break
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={baseId}
        className={[
          classes.trigger,
          fullWidth ? classes.fullWidth : '',
          invalid ? classes.triggerInvalid : '',
          open ? classes.triggerOpen : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && highlight >= 0 ? `${baseId}-opt-${highlight}` : undefined}
      >
        <span className={`${classes.value} ${selected ? '' : classes.placeholder}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`${classes.chevron} ${open ? classes.chevronOpen : ''}`}
          size={18}
          strokeWidth={2}
        />
      </button>

      <Portal isOpen={open} rootId="modal-root">
        <AnimatePresence>
          {open && coords && (
            <motion.div
              ref={menuRef}
              id={listId}
              role="listbox"
              className={classes.menu}
              style={{
                top: coords.top,
                left: coords.left,
                minWidth: coords.width,
                maxHeight: coords.maxHeight,
              }}
              initial={{ opacity: 0, y: coords.placement === 'bottom' ? -6 : 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: coords.placement === 'bottom' ? -6 : 6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              {options.map((option, index) => {
                const isSelected = option.value === value
                const isActive = index === highlight
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    id={`${baseId}-opt-${index}`}
                    aria-selected={isSelected}
                    className={[
                      classes.option,
                      isActive ? classes.optionActive : '',
                      isSelected ? classes.optionSelected : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onMouseEnter={() => setHighlight(index)}
                    onClick={() => choose(index)}
                  >
                    <span className={classes.optionLabel}>{option.label}</span>
                    {isSelected && <Check className={classes.optionCheck} size={16} strokeWidth={2} />}
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
