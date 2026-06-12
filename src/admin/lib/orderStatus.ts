import type { ApiOrder } from '../../shared/api/types'

/** Статусы заявок — единый источник правды для бейджей, фильтров и дропдауна. */
export type OrderStatus = ApiOrder['status']

export type StatusTone = 'blue' | 'amber' | 'green' | 'red'

export interface OrderStatusMeta {
  value: OrderStatus
  label: string
  tone: StatusTone
}

export const ORDER_STATUSES: OrderStatusMeta[] = [
  { value: 'new', label: 'Новая', tone: 'blue' },
  { value: 'in_progress', label: 'В обработке', tone: 'amber' },
  { value: 'done', label: 'Завершена', tone: 'green' },
  { value: 'cancelled', label: 'Отменена', tone: 'red' },
]

export const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusMeta> = ORDER_STATUSES.reduce(
  (acc, meta) => {
    acc[meta.value] = meta
    return acc
  },
  {} as Record<OrderStatus, OrderStatusMeta>,
)
