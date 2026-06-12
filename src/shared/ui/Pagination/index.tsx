import clsx from 'clsx'
import classes from './pagination.module.scss'

interface Props {
  page: number
  pageSize: number
  total: number
  onChange(page: number): void
}

const range = (count: number) => Array.from({ length: count }, (_, i) => i + 1)

export const Pagination = ({ page, pageSize, total, onChange }: Props) => {
  const pages = Math.ceil(total / pageSize)
  if (pages <= 1) return null

  return (
    <div className={classes.pagination}>
      <button
        type="button"
        className={classes.arrow}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Предыдущая страница"
      >
        ←
      </button>
      {range(pages).map((p) => (
        <button
          key={p}
          type="button"
          className={clsx(classes.page, p === page && classes.active)}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        className={classes.arrow}
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        aria-label="Следующая страница"
      >
        →
      </button>
    </div>
  )
}
