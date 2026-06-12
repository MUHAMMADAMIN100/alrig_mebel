import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wrapper } from '../../../shared/ui/Wrapper'
import { Breadcrumbs } from '../../../shared/ui/Breadcrumbs'
import { useCategories } from '../../../shared/api/hooks'
import classes from './main.module.scss'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const SkeletonGrid = () => (
  <div className={classes.grid}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className={classes.skeletonCard} />
    ))}
  </div>
)

export const Products = () => {
  const { data: categories, isLoading, isError } = useCategories()

  return (
    <Wrapper>
      <div className={classes.header}>
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог' }]} />
        <h1 className={classes.title}>Каталог товаров</h1>
        <p className={classes.subtitle}>Бытовая техника ALRIG — выберите категорию</p>
      </div>

      {isLoading && <SkeletonGrid />}

      {isError && (
        <div className={classes.state}>
          <p>Не удалось загрузить каталог. Попробуйте обновить страницу.</p>
        </div>
      )}

      {categories && categories.length === 0 && (
        <div className={classes.state}>
          <p>Каталог пока пуст.</p>
        </div>
      )}

      {categories && categories.map((category) => (
        <section key={category.id} className={classes.section}>
          <div className={classes.sectionHead}>
            <h2 className={classes.sectionTitle}>{category.name}</h2>
            <Link to={`/category/${category.slug}`} className={classes.sectionLink}>
              Все товары ({category.products_count}) →
            </Link>
          </div>
          <motion.div
            className={classes.grid}
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {category.subcategories.map((sub) => (
              <motion.div key={sub.id} variants={itemVariants}>
                <Link to={`/products/${sub.slug}`} className={classes.card}>
                  <div className={classes.imageWrap}>
                    {sub.image ? (
                      <img className={classes.image} src={sub.image} alt={sub.name} loading="lazy" />
                    ) : (
                      <div className={classes.noImage} />
                    )}
                  </div>
                  <div className={classes.cardBody}>
                    <h3 className={classes.cardTitle}>{sub.name}</h3>
                    <p className={classes.cardCount}>
                      {sub.products_count}{' '}
                      {sub.products_count === 1 ? 'модель' : sub.products_count < 5 ? 'модели' : 'моделей'}
                    </p>
                    <span className={classes.cardLink}>Смотреть →</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      ))}
    </Wrapper>
  )
}
