import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ArrowRight, Inbox, Plus } from 'lucide-react'
import { getCategories, getProducts, getSubcategories } from '../../../shared/api/catalog'
import { adminGetOrders } from '../../../shared/api/admin'
import { StatusBadge } from '../../components/StatusBadge'
import { ICON_SIZE, ICON_STROKE } from '../../lib/icons'
import classes from '../../admin.module.scss'

export const DashboardPage = () => {
  const { data: categories } = useQuery('admin-categories', getCategories)
  const { data: subcategories } = useQuery('admin-subcategories', () => getSubcategories())
  const { data: products } = useQuery('admin-products-count', () => getProducts({ page_size: 1 }))
  const { data: orders } = useQuery('admin-orders-recent', () => adminGetOrders({ page_size: 6 }))

  const newOrders = orders?.results.filter((o) => o.status === 'new').length ?? 0

  return (
    <div>
      <div className={classes.pageHead}>
        <div>
          <h1 className={classes.pageTitle}>Дашборд</h1>
          <p className={classes.pageSubtitle}>Обзор каталога и заявок</p>
        </div>
        <Link to="/admin/products/new" className={classes.btnPrimary}>
          <Plus size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
          Добавить товар
        </Link>
      </div>

      <div className={classes.statsGrid}>
        <Link to="/admin/products" className={classes.statCard}>
          <span className={classes.statValue}>{products?.count ?? '—'}</span>
          <span className={classes.statLabel}>Товаров в каталоге</span>
        </Link>
        <Link to="/admin/categories" className={classes.statCard}>
          <span className={classes.statValue}>{categories?.length ?? '—'}</span>
          <span className={classes.statLabel}>Категорий</span>
        </Link>
        <Link to="/admin/subcategories" className={classes.statCard}>
          <span className={classes.statValue}>{subcategories?.length ?? '—'}</span>
          <span className={classes.statLabel}>Подкатегорий</span>
        </Link>
        <Link to="/admin/orders" className={classes.statCard}>
          <span className={`${classes.statValue} ${newOrders > 0 ? classes.statAccent : ''}`}>
            {orders ? orders.count : '—'}
          </span>
          <span className={classes.statLabel}>
            Заявок всего{newOrders > 0 ? ` · ${newOrders} новых` : ''}
          </span>
        </Link>
      </div>

      <div className={classes.card}>
        <div className={classes.pageHead} style={{ marginBottom: 14 }}>
          <h2 className={classes.pageTitle} style={{ fontSize: 18 }}>Последние заявки</h2>
          <Link to="/admin/orders" className={classes.btnGhost}>
            Все заявки
            <ArrowRight size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
          </Link>
        </div>

        {orders && orders.results.length === 0 && (
          <div className={classes.emptyState}>
            <Inbox className={classes.emptyIcon} size={ICON_SIZE.empty} strokeWidth={ICON_STROKE} />
            <b>Заявок пока нет</b>
            Они появятся, когда клиенты начнут оформлять заказы.
          </div>
        )}

        {orders && orders.results.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Товар</th>
                  <th>Статус</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {orders.results.map((order) => (
                  <tr key={order.id}>
                    <td data-label="Имя" className={classes.tableTitle}>{order.name}</td>
                    <td data-label="Телефон">{order.phone}</td>
                    <td data-label="Товар">
                      {order.product_detail ? order.product_detail.name : <span className={classes.dash}>—</span>}
                    </td>
                    <td data-label="Статус"><StatusBadge status={order.status} /></td>
                    <td data-label="Дата">{new Date(order.created).toLocaleDateString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
