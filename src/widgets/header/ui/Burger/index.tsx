import { useMenuStore } from '../../model/manu'
import classes from './burger.module.scss'
import clsx from 'clsx'

export const Burger = () => {
  const { isOpen, toggle } = useMenuStore(({ isOpen, toggle }) => ({
    isOpen,
    toggle,
  }))

  return (
    <button
      className={clsx(
        classes.burger,
        classes.mainPage,
        isOpen && classes.open,
      )}
      aria-label={isOpen ? 'Close' : 'Open'}
      onClick={toggle}
    >
      <span />
    </button>
  )
}


