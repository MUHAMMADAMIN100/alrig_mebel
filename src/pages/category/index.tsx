import { Link, useParams } from 'react-router-dom'
import { Wrapper } from '../../shared/ui/Wrapper'
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import { useCategory } from '../../shared/api/hooks'
import { ProductListing } from '../../widgets/products/listing'
import classes from './category.module.scss'

export const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: category } = useCategory(slug)

  return (
    <Wrapper>
      <div className={classes.header}>
        <Breadcrumbs
          items={[
            { label: 'Главная', to: '/' },
            { label: 'Каталог', to: '/products' },
            { label: category?.name ?? '…' },
          ]}
        />
        <h1 className={classes.title}>{category?.name ?? 'Загрузка…'}</h1>
      </div>

      {category && category.subcategories.length > 0 && (
        <div className={classes.subcats}>
          {category.subcategories.map((sub) => (
            <Link key={sub.id} to={`/products/${sub.slug}`} className={classes.subcat}>
              {sub.image && <img className={classes.subcatImage} src={sub.image} alt={sub.name} loading="lazy" />}
              <span>{sub.name}</span>
              <span className={classes.subcatCount}>{sub.products_count}</span>
            </Link>
          ))}
        </div>
      )}

      <ProductListing filter={{ category: slug }} />
      <div className={classes.bottomGap} />
    </Wrapper>
  )
}
