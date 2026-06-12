import { ORDER_STATUS_MAP, OrderStatus } from '../lib/orderStatus'
import classes from './status.module.scss'

/** Только для отображения статуса (без выбора). */
export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const meta = ORDER_STATUS_MAP[status]
  return (
    <span className={`${classes.badge} ${classes[meta.tone]}`}>
      <span className={classes.dot} />
      {meta.label}
    </span>
  )
}
