import { useState } from 'react'
import { useProducts } from '../../../shared/api/hooks'
import { ProductsParams } from '../../../shared/api/types'
import { Pagination } from '../../../shared/ui/Pagination'
import { Select, SelectOption } from '../../../shared/ui/Select'
import { ProductCard } from '../product-card'
import classes from './listing.module.scss'

const PAGE_SIZE = 12

const SORT_OPTIONS: SelectOption[] = [
  { value: '', label: 'По умолчанию' },
  { value: 'price', label: 'Сначала дешевле' },
  { value: '-price', label: 'Сначала дороже' },
  { value: '-created_at', label: 'Сначала новые' },
]

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
        <Select
          ariaLabel="Сортировка"
          value={ordering}
          onChange={handleSort}
          options={SORT_OPTIONS}
        />
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
