import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrapper } from '../../../shared/ui/Wrapper';
import { Category, CatalogProduct } from '../../../data/products';
import classes from './category-page.module.scss';

interface CategoryPageProps {
  category: Category;
}

const ProductCard = ({ product }: { product: CatalogProduct }) => {
  const [activeImg, setActiveImg] = useState(0);
  const hasImages = product.images.length > 0;

  return (
    <div className={classes.card}>
      <div className={classes.media}>
        {hasImages ? (
          <>
            <div className={classes.mainImgWrap}>
              <img
                className={classes.mainImg}
                src={product.images[activeImg]}
                alt={product.title}
                loading="lazy"
              />
              {product.badges && product.badges.length > 0 && (
                <div className={classes.badges}>
                  {product.badges.map((b) => (
                    <span key={b} className={classes.badge}>{b}</span>
                  ))}
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className={classes.thumbs}>
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${classes.thumb} ${i === activeImg ? classes.thumbActive : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Фото ${i + 1}`}
                  >
                    <img src={src} alt={`${product.title} фото ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={classes.noImage}>
            <span>Фото скоро</span>
          </div>
        )}
      </div>

      <div className={classes.info}>
        <div className={classes.infoTop}>
          <h2 className={classes.productTitle}>{product.title}</h2>
          {product.subtitle && <p className={classes.productSubtitle}>{product.subtitle}</p>}
        </div>

        {product.priceFrom && (
          <div className={classes.price}>
            <span className={classes.priceValue}>{product.priceFrom.toLocaleString()}</span>
            <span className={classes.priceCurrency}> {product.currency ?? 'сомони'}</span>
          </div>
        )}

        {product.description && (
          <p className={classes.description}>{product.description}</p>
        )}

        {product.specs.length > 0 && (
          <div className={classes.specs}>
            <h3 className={classes.specsTitle}>Характеристики</h3>
            <div className={classes.specsTable}>
              {product.specs.map((s) => (
                <div key={s.label} className={classes.specRow}>
                  <span className={classes.specLabel}>{s.label}</span>
                  <span className={classes.specValue}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <a href="tel:975205115" className={classes.phoneBtn}>
          Позвонить: 975 20 51 15
        </a>
      </div>
    </div>
  );
};

export const CategoryPage = ({ category }: CategoryPageProps) => {
  return (
    <Wrapper>
      <div className={classes.pageHeader}>
        <Link to="/products" className={classes.back}>← Все категории</Link>
        <h1 className={classes.pageTitle}>{category.name}</h1>
        <p className={classes.pageCount}>
          {category.products.length}{' '}
          {category.products.length === 1 ? 'модель' : 'модели'} в наличии
        </p>
      </div>
      <div className={classes.list}>
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Wrapper>
  );
};
