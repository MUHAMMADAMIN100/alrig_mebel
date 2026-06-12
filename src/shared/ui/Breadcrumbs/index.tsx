import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import classes from './breadcrumbs.module.scss'

export interface Crumb {
  label: string
  to?: string
}

export const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  return (
    <nav className={classes.breadcrumbs} aria-label="Хлебные крошки">
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span className={classes.sep}>/</span>}
          {item.to ? (
            <Link to={item.to} className={classes.link}>{item.label}</Link>
          ) : (
            <span className={classes.current}>{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
