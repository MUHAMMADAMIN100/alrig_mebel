import { useState } from 'react'
import { useProducts } from '../../../shared/api/hooks'
import { ProductsParams } from '../../../shared/api/types'
import { Pagination } from '../../../shared/ui/Pagination'
import { ProductCard } from '../product-card'
import classes from './listing.module.scss'

const PAGE_SIZE = 12

const SORT_OPTIONS = [
  { value: '', label: 'По умолчанию' },
  { value: 'price', label: 'Сначала дешевле' },
  { value: '-price', label: 'Сначала дороже' },
  { value: '-created_at', label: 'Сначала новые' },
] as const

interface Props {
  filter: Pick<ProductsParams, 'category' | 'subcategory' | 'featured' | 'search'>
}

export const ProductListing = ({ filter }: Props) => {
  const [page, setPage] = useState(1)
  const [ordering, setOrdering] = useState('')

  const { data, isLoading, isError } = useProducts({
    ...filter,
    ordering: ordering || undefined,
    page,
    page_size: PAGE_SIZE,
  })

  const handleSort = (value: string) => {
    setOrdering(value)
    setPage(1)
  }

  if (isLoading) {
    return (
      <div className={classes.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={classes.skeletonCard} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className={classes.state}>
        <p className={classes.stateTitle}>Не удалось загрузить товары</p>
        <p>Проверьте подключение и обновите страницу.</p>
      </div>
    )
  }

  if (!data || data.count === 0) {
    return (
      <div className={classes.state}>
        <p className={classes.stateTitle}>Здесь пока нет товаров</p>
        <p>Загляните позже — мы постоянно пополняем каталог.</p>
      </div>
    )
  }

  return (
    <>
      <div className={classes.toolbar}>
        <p className={classes.count}>
          Найдено: <b>{data.count}</b>
        </p>
        <select
          className={classes.sort}
          value={ordering}
          onChange={(e) => handleSort(e.target.value)}
          aria-label="Сортировка"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className={classes.grid}>
        {data.results.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={data.count}
        onChange={(p) => {
          setPage(p)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    </>
  )
}
