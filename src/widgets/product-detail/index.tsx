import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules'
import { Wrapper } from '../../shared/ui/Wrapper'
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import { Modal } from '../../shared/ui/Modal'
import { useProduct } from '../../shared/api/hooks'
import { formatPrice } from '../../shared/lib/formatPrice'
import { OrderModal } from '../order-modal'
import { CONTACTS } from '../../shared/const/contacts'
import classes from './product-detail.module.scss'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Skeleton = () => (
  <div className={classes.skeleton}>
    <div className={classes.skeletonGallery} />
    <div className={classes.skeletonInfo}>
      <div className={classes.skeletonLine} style={{ width: '40%' }} />
      <div className={classes.skeletonLine} style={{ width: '85%', height: 32 }} />
      <div className={classes.skeletonLine} style={{ width: '60%' }} />
      <div className={classes.skeletonLine} style={{ width: '30%', height: 40 }} />
      <div className={classes.skeletonLine} style={{ width: '100%', height: 120 }} />
    </div>
  </div>
)

export const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, isError } = useProduct(slug)
  const [activeImage, setActiveImage] = useState(0)
  const [isZoomOpen, setZoomOpen] = useState(false)
  const [isOrderOpen, setOrderOpen] = useState(false)

  if (isLoading) {
    return <Wrapper><Skeleton /></Wrapper>
  }

  if (isError || !product) {
    return (
      <Wrapper>
        <div className={classes.state}>
          <p className={classes.stateTitle}>Товар не найден</p>
          <p>Возможно, он был удалён или ссылка устарела.</p>
        </div>
      </Wrapper>
    )
  }

  const images = product.images
  const discount = product.old_price
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.old_price)) * 100)
    : 0

  return (
    <Wrapper>
      <div className={classes.top}>
        <Breadcrumbs
          items={[
            { label: 'Главная', to: '/' },
            { label: 'Каталог', to: '/products' },
            { label: product.category.name, to: `/category/${product.category.slug}` },
            { label: product.subcategory.name, to: `/products/${product.subcategory.slug}` },
            { label: product.name },
          ]}
        />
      </div>

      <motion.div
        className={classes.main}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* ── Галерея ── */}
        <div className={classes.gallery}>
          <button
            type="button"
            className={classes.mainImageWrap}
            onClick={() => images.length > 0 && setZoomOpen(true)}
            aria-label="Увеличить фото"
          >
            {images.length > 0 ? (
              <img
                key={images[activeImage]?.id}
                className={classes.mainImage}
                src={images[activeImage]?.image}
                alt={images[activeImage]?.alt || product.name}
              />
            ) : (
              <div className={classes.noImage}>Фото скоро</div>
            )}
            {images.length > 0 && <span className={classes.zoomHint}>🔍 Увеличить</span>}
          </button>

          {images.length > 1 && (
            <div className={classes.thumbs}>
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  className={i === activeImage ? classes.thumbActive : classes.thumb}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Фото ${i + 1}`}
                >
                  <img src={img.image} alt={img.alt || `${product.name} — фото ${i + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Информация ── */}
        <div className={classes.info}>
          <p className={classes.categoryLabel}>{product.subcategory.name}</p>
          <h1 className={classes.title}>{product.name}</h1>
          {product.subtitle && <p className={classes.subtitle}>{product.subtitle}</p>}

          <div className={classes.badges}>
            {product.in_stock ? (
              <span className={classes.badgeStock}>✓ В наличии</span>
            ) : (
              <span className={classes.badgeOut}>Нет в наличии</span>
            )}
            {discount > 0 && <span className={classes.badgeSale}>Скидка −{discount}%</span>}
          </div>

          <div className={classes.priceRow}>
            <span className={classes.price}>
              {formatPrice(product.price)} <span className={classes.currency}>{product.currency}</span>
            </span>
            {product.old_price && (
              <span className={classes.oldPrice}>{formatPrice(product.old_price)} {product.currency}</span>
            )}
          </div>

          <div className={classes.actions}>
            <button
              type="button"
              className={classes.orderBtn}
              data-testid="order-button"
              onClick={() => setOrderOpen(true)}
            >
              Заказать
            </button>
            <a href={CONTACTS.phone.href} className={classes.phoneBtn}>
              {CONTACTS.phone.label}
            </a>
          </div>

          <div className={classes.perks}>
            <div className={classes.perk}>
              <span className={classes.perkIcon}>💳</span>
              <span>Оплата: наличные / перевод</span>
            </div>
            <div className={classes.perk}>
              <span className={classes.perkIcon}>🚚</span>
              <span>Доставка по Душанбе</span>
            </div>
            <div className={classes.perk}>
              <span className={classes.perkIcon}>🛡</span>
              <span>Официальная гарантия</span>
            </div>
          </div>

          {product.description && (
            <div className={classes.description}>
              <h2 className={classes.blockTitle}>Описание</h2>
              <p>{product.description}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Характеристики ── */}
      {product.specs.length > 0 && (
        <motion.div
          className={classes.specs}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <h2 className={classes.blockTitle}>Характеристики</h2>
          <div className={classes.specsTable}>
            {product.specs.map((spec) => (
              <div key={spec.id} className={classes.specRow}>
                <span className={classes.specLabel}>{spec.label}</span>
                <span className={classes.specDots} />
                <span className={classes.specValue}>{spec.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Зум-галерея ── */}
      <Modal isOpen={isZoomOpen} close={() => setZoomOpen(false)} contentClassName={classes.zoomModal}>
        <div className={classes.zoomBody}>
          <Swiper
            modules={[Navigation, SwiperPagination]}
            navigation
            pagination={{ clickable: true }}
            initialSlide={activeImage}
            className={classes.zoomSwiper}
          >
            {images.map((img) => (
              <SwiperSlide key={img.id}>
                <img className={classes.zoomImage} src={img.image} alt={img.alt || product.name} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Modal>

      <OrderModal
        isOpen={isOrderOpen}
        close={() => setOrderOpen(false)}
        productId={product.id}
        productName={`${product.name}${product.subtitle ? ` (${product.subtitle})` : ''}`}
      />
    </Wrapper>
  )
}
