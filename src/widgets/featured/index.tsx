import { Link } from 'react-router-dom'
import { Wrapper } from '../../shared/ui/Wrapper'
import { useCategories, useProducts } from '../../shared/api/hooks'
import { ProductCard } from '../products/product-card'
import classes from './featured.module.scss'

export const Featured = () => {
  const { data: products } = useProducts({ featured: true, page_size: 8 })
  const { data: categories } = useCategories()

  const subcategories = (categories ?? []).flatMap((c) => c.subcategories)

  return (
    <Wrapper>
      {/* ── Подкатегории-плитки ── */}
      {subcategories.length > 0 && (
        <section className={classes.section}>
          <div className={classes.head}>
            <h2 className={classes.title}>Категории</h2>
            <Link to="/products" className={classes.link}>Весь каталог →</Link>
          </div>
          <div className={classes.chips}>
            {subcategories.map((sub) => (
              <Link key={sub.id} to={`/products/${sub.slug}`} className={classes.chip}>
                {sub.image && <img className={classes.chipImage} src={sub.image} alt={sub.name} loading="lazy" />}
                <span className={classes.chipName}>{sub.name}</span>
                <span className={classes.chipCount}>{sub.products_count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Популярные товары ── */}
      {products && products.results.length > 0 && (
        <section className={classes.section}>
          <div className={classes.head}>
            <h2 className={classes.title}>Популярные товары</h2>
          </div>
          <div className={classes.grid}>
            {products.results.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>
      )}
    </Wrapper>
  )
}
