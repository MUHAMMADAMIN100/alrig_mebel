import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useDebounceValue } from 'usehooks-ts'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight, ExternalLink, Pencil, Plus, SearchX, Trash2 } from 'lucide-react'
import { getCategories, getProducts, getSubcategories } from '../../../shared/api/catalog'
import { adminDeleteProduct } from '../../../shared/api/admin'
import { ApiProduct } from '../../../shared/api/types'
import { formatPrice } from '../../../shared/lib/formatPrice'
import { Select } from '../../../shared/ui/Select'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { apiErrorMessage } from '../../lib/apiError'
import { ICON_SIZE, ICON_STROKE } from '../../lib/icons'
import classes from '../../admin.module.scss'

const PAGE_SIZE = 12

export const AdminProductsPage = () => {
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [categorySlug, setCategorySlug] = useState('')
  const [subcategorySlug, setSubcategorySlug] = useState('')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState<ApiProduct | null>(null)

  const [debouncedSearch] = useDebounceValue(search, 350)

  const { data: categories } = useQuery('admin-categories', getCategories)
  const { data: subcategories } = useQuery('admin-subcategories', () => getSubcategories())

  const { data: products, isLoading } = useQuery(
    ['admin-products', debouncedSearch, categorySlug, subcategorySlug, page],
    () => getProducts({
      search: debouncedSearch || undefined,
      category: categorySlug || undefined,
      subcategory: subcategorySlug || undefined,
      page,
      page_size: PAGE_SIZE,
    }),
    { keepPreviousData: true },
  )

  // подкатегории, отфильтрованные по выбранной категории (каскад)
  const subcategoryOptions = useMemo(() => {
    if (!subcategories) return []
    if (!categorySlug) return subcategories
    return subcategories.filter((sub) => sub.category.slug === categorySlug)
  }, [subcategories, categorySlug])

  const deleteMutation = useMutation(
    (slug: string) => adminDeleteProduct(slug),
    {
      onSuccess: () => {
        toast.success('Товар удалён')
        queryClient.invalidateQueries('admin-products')
        queryClient.invalidateQueries('admin-products-count')
        queryClient.invalidateQueries('products')
        setDeleting(null)
      },
      onError: (error) => {
        toast.error(apiErrorMessage(error, 'Не удалось удалить товар'))
        setDeleting(null)
      },
    },
  )

  const totalPages = products ? Math.ceil(products.count / PAGE_SIZE) : 0

  return (
    <div>
      <div className={classes.pageHead}>
        <div>
          <h1 className={classes.pageTitle}>Товары</h1>
          <p className={classes.pageSubtitle}>
            {products ? `Всего: ${products.count}` : 'Загрузка…'}
          </p>
        </div>
        <Link to="/admin/products/new" className={classes.btnPrimary}>
          <Plus size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
          Добавить товар
        </Link>
      </div>

      <div className={classes.toolbar}>
        <input
          className={classes.searchInput}
          type="search"
          placeholder="Поиск по названию…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
        <Select
          ariaLabel="Фильтр по категории"
          value={categorySlug}
          onChange={(val) => {
            setCategorySlug(val)
            setSubcategorySlug('')
            setPage(1)
          }}
          options={[
            { value: '', label: 'Все категории' },
            ...(categories?.map((cat) => ({ value: cat.slug, label: cat.name })) ?? []),
          ]}
        />
        <Select
          ariaLabel="Фильтр по подкатегории"
          value={subcategorySlug}
          onChange={(val) => { setSubcategorySlug(val); setPage(1) }}
          options={[
            { value: '', label: 'Все подкатегории' },
            ...subcategoryOptions.map((sub) => ({ value: sub.slug, label: sub.name })),
          ]}
        />
      </div>

      {isLoading && !products && (
        <div>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className={classes.skeletonRow} />)}
        </div>
      )}

      {products && (
        <>
          <div className={classes.tableWrap}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>Фото</th>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Подкатегория</th>
                  <th>Цена</th>
                  <th>Статусы</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.results.map((product) => (
                  <tr key={product.id}>
                    <td data-label="Фото">
                      {product.main_image
                        ? <img className={classes.tableImage} src={product.main_image.image} alt={product.name} />
                        : <div className={classes.tableImage} />}
                    </td>
                    <td data-label="Название">
                      <div className={classes.cellStack}>
                        <span className={classes.tableTitle}>{product.name}</span>
                        {product.subtitle && <span className={classes.tableSub}>{product.subtitle}</span>}
                      </div>
                    </td>
                    <td data-label="Категория">{product.category.name}</td>
                    <td data-label="Подкатегория">{product.subcategory.name}</td>
                    <td data-label="Цена" style={{ whiteSpace: 'nowrap' }}>
                      <div className={classes.cellStack}>
                        <span className={classes.tableTitle}>{formatPrice(product.price)} {product.currency}</span>
                        {product.old_price && (
                          <span className={classes.tableSub} style={{ textDecoration: 'line-through' }}>
                            {formatPrice(product.old_price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td data-label="Статусы">
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {product.is_active
                          ? <span className={classes.badgeGreen}>Активен</span>
                          : <span className={classes.badgeGray}>Скрыт</span>}
                        {!product.in_stock && <span className={classes.badgeRed}>Нет в наличии</span>}
                        {product.is_featured && <span className={classes.badgeYellow}>Хит</span>}
                      </div>
                    </td>
                    <td data-label="">
                      <div className={classes.rowActions}>
                        <a
                          href={`/product/${product.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className={classes.btnIcon}
                          aria-label="Открыть на сайте"
                        >
                          <ExternalLink size={ICON_SIZE.action} strokeWidth={ICON_STROKE} />
                        </a>
                        <Link
                          to={`/admin/products/${product.slug}/edit`}
                          className={classes.btnIcon}
                          aria-label="Редактировать"
                        >
                          <Pencil size={ICON_SIZE.action} strokeWidth={ICON_STROKE} />
                        </Link>
                        <button
                          type="button"
                          className={classes.btnIconDanger}
                          onClick={() => setDeleting(product)}
                          aria-label="Удалить"
                        >
                          <Trash2 size={ICON_SIZE.action} strokeWidth={ICON_STROKE} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.results.length === 0 && (
              <div className={classes.emptyState}>
                <SearchX className={classes.emptyIcon} size={ICON_SIZE.empty} strokeWidth={ICON_STROKE} />
                <b>Товары не найдены</b>
                Попробуйте изменить фильтры или создайте новый товар.
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

      <ConfirmDialog
        isOpen={!!deleting}
        title="Удалить товар?"
        text={`«${deleting?.name}${deleting?.subtitle ? ` (${deleting.subtitle})` : ''}» будет удалён безвозвратно вместе с фотографиями.`}
        isLoading={deleteMutation.isLoading}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.slug)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
