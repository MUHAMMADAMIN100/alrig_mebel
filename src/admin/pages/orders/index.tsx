import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useDebounceValue } from 'usehooks-ts'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight, Inbox, Trash2 } from 'lucide-react'
import WhatsAppIcon from '@icons/whatsapp.svg?react'
import { adminDeleteOrder, adminGetOrders, adminUpdateOrder } from '../../../shared/api/admin'
import { ApiOrder, Paginated } from '../../../shared/api/types'
import { ConfirmModal } from '../../../shared/ui/ConfirmModal'
import { StatusSelect } from '../../components/StatusSelect'
import { apiErrorMessage } from '../../lib/apiError'
import { ICON_SIZE, ICON_STROKE } from '../../lib/icons'
import { ORDER_STATUSES, OrderStatus } from '../../lib/orderStatus'
import classes from '../../admin.module.scss'

const PAGE_SIZE = 15

type StatusFilter = OrderStatus | 'all'

const FILTER_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  ...ORDER_STATUSES.map((status) => ({ value: status.value, label: status.label })),
]

const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

const Dash = () => <span className={classes.dash}>—</span>

export const AdminOrdersPage = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<ApiOrder | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [debouncedSearch] = useDebounceValue(search, 350)

  const ordersKey = ['admin-orders', page, statusFilter, debouncedSearch] as const

  const { data: orders, isLoading } = useQuery(
    ordersKey,
    () =>
      adminGetOrders({
        page,
        page_size: PAGE_SIZE,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: debouncedSearch || undefined,
      }),
    { keepPreviousData: true },
  )

  const statusMutation = useMutation(
    ({ id, status }: { id: number; status: OrderStatus }) => adminUpdateOrder(id, { status }),
    {
      // оптимистичное обновление: статус меняется в UI мгновенно
      onMutate: async ({ id, status }) => {
        await queryClient.cancelQueries('admin-orders')
        const previous = queryClient.getQueryData<Paginated<ApiOrder>>(ordersKey)
        if (previous) {
          queryClient.setQueryData<Paginated<ApiOrder>>(ordersKey, {
            ...previous,
            results: previous.results.map((order) =>
              order.id === id ? { ...order, status } : order,
            ),
          })
        }
        return { previous }
      },
      onError: (error, _vars, context) => {
        const ctx = context as { previous?: Paginated<ApiOrder> } | undefined
        if (ctx?.previous) queryClient.setQueryData(ordersKey, ctx.previous)
        toast.error(apiErrorMessage(error))
      },
      onSuccess: () => {
        toast.success('Статус обновлён')
      },
      onSettled: () => {
        queryClient.invalidateQueries('admin-orders')
        queryClient.invalidateQueries('admin-orders-recent')
      },
    },
  )

  const deleteMutation = useMutation((id: number) => adminDeleteOrder(id), {
    onSuccess: () => {
      toast.success('Удалено')
      queryClient.invalidateQueries('admin-orders')
      queryClient.invalidateQueries('admin-orders-recent')
      setDeleting(null)
      setDeleteError(null)
    },
    onError: (error) => {
      setDeleteError(apiErrorMessage(error))
    },
  })

  const closeDelete = () => {
    setDeleting(null)
    setDeleteError(null)
  }

  const totalPages = orders ? Math.ceil(orders.count / PAGE_SIZE) : 0
  const isFiltered = statusFilter !== 'all' || debouncedSearch.length > 0

  return (
    <div>
      <div className={classes.pageHead}>
        <div>
          <h1 className={classes.pageTitle}>Заявки</h1>
          <p className={classes.pageSubtitle}>
            {orders ? `Всего: ${orders.count}` : 'Загрузка…'}
          </p>
        </div>
      </div>

      <div className={classes.ordersToolbar}>
        <div className={classes.statusTabs}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`${classes.chip} ${statusFilter === tab.value ? classes.chipActive : ''}`}
              onClick={() => {
                setStatusFilter(tab.value)
                setPage(1)
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <input
          className={classes.searchInput}
          type="search"
          placeholder="Поиск по имени или телефону…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      {isLoading && !orders && (
        <div>
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className={classes.skeletonRow} />)}
        </div>
      )}

      {orders && (
        <>
          <div className={classes.tableWrap}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Товар</th>
                  <th>Комментарий</th>
                  <th>Статус</th>
                  <th>Дата</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {orders.results.map((order) => (
                  <tr key={order.id}>
                    <td data-label="№" className={classes.idCell}>{order.id}</td>
                    <td data-label="Имя" className={classes.tableTitle}>{order.name}</td>
                    <td data-label="Телефон">
                      <div className={classes.phoneCell}>
                        <a href={`tel:${order.phone}`} className={classes.phoneLink}>{order.phone}</a>
                        <a
                          href={waLink(order.phone)}
                          target="_blank"
                          rel="noreferrer"
                          className={classes.waLink}
                          aria-label="Написать в WhatsApp"
                          title="WhatsApp"
                        >
                          <WhatsAppIcon className={classes.waIcon} />
                        </a>
                      </div>
                    </td>
                    <td data-label="Товар">
                      {order.product_detail ? (
                        <Link
                          to={`/product/${order.product_detail.slug}`}
                          target="_blank"
                          className={classes.productLink}
                        >
                          <span className={classes.tableTitle}>{order.product_detail.name}</span>
                          {order.product_detail.subtitle && (
                            <span className={classes.tableSub}>{order.product_detail.subtitle}</span>
                          )}
                        </Link>
                      ) : (
                        <Dash />
                      )}
                    </td>
                    <td data-label="Комментарий" className={classes.commentCell}>
                      {order.comment ? order.comment : <Dash />}
                    </td>
                    <td data-label="Статус">
                      <StatusSelect
                        value={order.status}
                        onChange={(status) => statusMutation.mutate({ id: order.id, status })}
                      />
                    </td>
                    <td data-label="Дата" className={classes.nowrap}>{formatDate(order.created)}</td>
                    <td data-label="">
                      <div className={classes.rowActions}>
                        <button
                          type="button"
                          className={classes.btnIconDanger}
                          onClick={() => setDeleting(order)}
                          aria-label="Удалить заявку"
                        >
                          <Trash2 size={ICON_SIZE.action} strokeWidth={ICON_STROKE} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.results.length === 0 && (
              <div className={classes.emptyState}>
                <Inbox className={classes.emptyIcon} size={ICON_SIZE.empty} strokeWidth={ICON_STROKE} />
                <b>{isFiltered ? 'Ничего не найдено' : 'Заявок пока нет'}</b>
                {isFiltered
                  ? 'Измените фильтр или поисковый запрос.'
                  : 'Они появятся, когда клиенты начнут оформлять заказы на сайте.'}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className={classes.tablePagination}>
              <button
                type="button"
                className={classes.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
                Назад
              </button>
              <span>Стр. {page} из {totalPages}</span>
              <button
                type="button"
                className={classes.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Вперёд
                <ChevronRight size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Удалить заявку?"
        description={`Заявка #${deleting?.id} от «${deleting?.name}». Действие необратимо.`}
        isLoading={deleteMutation.isLoading}
        errorMessage={deleteError}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        onCancel={closeDelete}
      />
    </div>
  )
}
