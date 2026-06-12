import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ApiProduct } from '../../../shared/api/types'
import { formatPrice } from '../../../shared/lib/formatPrice'
import classes from './product-card.module.scss'

interface Props {
  product: ApiProduct
  index?: number
}

export const ProductCard = ({ product, index = 0 }: Props) => {
  const discount = product.old_price
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.old_price)) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index % 4, 3) * 0.07, ease: 'easeOut' }}
      className={classes.cardWrap}
    >
      <Link to={`/product/${product.slug}`} className={classes.card}>
        <div className={classes.media}>
          {product.main_image ? (
            <img
              className={classes.image}
              src={product.main_image.image}
              alt={product.main_image.alt || product.name}
              loading="lazy"
            />
          ) : (
            <div className={classes.noImage}>Фото скоро</div>
          )}
          <div className={classes.badges}>
            {product.in_stock && <span className={classes.badgeStock}>В наличии</span>}
            {discount > 0 && <span className={classes.badgeSale}>−{discount}%</span>}
            {product.is_featured && <span className={classes.badgeHit}>Хит</span>}
          </div>
        </div>

        <div className={classes.body}>
          <p className={classes.category}>{product.subcategory.name}</p>
          <h3 className={classes.title}>{product.name}</h3>
          {product.subtitle && <p className={classes.subtitle}>{product.subtitle}</p>}

          <div className={classes.bottom}>
            <div className={classes.priceBlock}>
              <span className={classes.price}>
                {formatPrice(product.price)} <span className={classes.currency}>{product.currency}</span>
              </span>
              {product.old_price && (
                <span className={classes.oldPrice}>{formatPrice(product.old_price)}</span>
              )}
            </div>
            <span className={classes.more}>Подробнее →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
