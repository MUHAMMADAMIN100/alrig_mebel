import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Wrapper } from '../../shared/ui/Wrapper'
import { useProducts } from '../../shared/api/hooks'
import { formatPrice } from '../../shared/lib/formatPrice'
import classes from './banner.module.scss'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

export const Banner = () => {
  const { data } = useProducts({ featured: true, page_size: 6 })
  const featured = data?.results ?? []

  return (
    <Wrapper>
      <motion.section
        className={classes.hero}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className={classes.heroGlow} />
        <div className={classes.content}>
          <motion.p
            className={classes.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
          >
            Бытовая техника в Душанбе
          </motion.p>
          <motion.h1
            className={classes.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            Техника ALRIG —<br />
            надёжно и доступно
          </motion.h1>
          <motion.p
            className={classes.subtitle}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.45 }}
          >
            Холодильники, стиральные машины, вытяжки и варочные панели.
            Рассрочка через карту Salom, гарантия до 5 лет, доставка по Душанбе.
          </motion.p>
          <motion.div
            className={classes.actions}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.45 }}
          >
            <Link to="/products" className={classes.primaryBtn}>
              Смотреть каталог
            </Link>
            <a href="tel:+992975205115" className={classes.secondaryBtn}>
              975 20 51 15
            </a>
          </motion.div>
          <motion.div
            className={classes.stats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className={classes.stat}>
              <b>5 лет</b>
              <span>гарантия</span>
            </div>
            <div className={classes.statDivider} />
            <div className={classes.stat}>
              <b>0%</b>
              <span>рассрочка Salom</span>
            </div>
            <div className={classes.statDivider} />
            <div className={classes.stat}>
              <b>1 день</b>
              <span>доставка</span>
            </div>
          </motion.div>
        </div>

        {featured.length > 0 && (
          <div className={classes.slider}>
            <Swiper
              modules={[Autoplay, EffectFade, Pagination]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              autoplay={{ delay: 3200, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={featured.length > 1}
              className={classes.swiper}
            >
              {featured.map((product) => (
                <SwiperSlide key={product.id}>
                  <Link to={`/product/${product.slug}`} className={classes.slide}>
                    {product.main_image && (
                      <img
                        className={classes.slideImage}
                        src={product.main_image.image}
                        alt={product.name}
                      />
                    )}
                    <div className={classes.slideInfo}>
                      <p className={classes.slideName}>{product.name}</p>
                      <p className={classes.slidePrice}>
                        {formatPrice(product.price)} {product.currency}
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </motion.section>
    </Wrapper>
  )
}
