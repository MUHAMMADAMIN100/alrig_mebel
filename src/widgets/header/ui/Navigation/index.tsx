import clsx from 'clsx'
import classes from './navigation.module.scss'
import useLockBodyScroll from '@custom-react-hooks/use-lock-body-scroll'
import { useMenuStore } from '../../model/manu'
import { navDate } from '../../const/navDate'


function Navigation() {
  const { isOpen, close } = useMenuStore((state) => (state))

  useLockBodyScroll(isOpen);
  return (
    <nav className={clsx(classes.nav, classes.mainPage)}>
      <div className={clsx(classes.menu, isOpen && classes.open)}>
        <ul className={classes.list}>
          {navDate.map(({ link, name }) => (
            <li
              key={link}
              className={classes.item}
            >
              <a href={link}
                className={clsx(
                  classes.link
                )}
                onClick={close}
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className={clsx(classes.wrapper, isOpen && classes.open_wrapper)} onClick={() => close()} ></div>
    </nav>
  )
}

export { Navigation }
