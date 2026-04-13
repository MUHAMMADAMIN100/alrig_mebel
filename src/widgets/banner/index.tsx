import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Wrapper } from '../../shared/ui/Wrapper';
import { categories } from '../../data/products';
import classes from './banner.module.scss';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const Banner = () => {
  return (
    <Wrapper>
      <div className={classes.carouselWrap}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className={classes.swiper}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id}>
              <div className={classes.slide}>
                <div
                  className={classes.slideImage}
                  style={{ backgroundImage: `url("${cat.coverImage}")` }}
                />
                <div className={classes.slideOverlay} />
                <div className={classes.slideContent}>
                  <p className={classes.slideLabel}>Бытовая техника</p>
                  <h2 className={classes.slideTitle}>{cat.name}</h2>
                  <Link to={`/products/${cat.slug}`} className={classes.slideBtn}>
                    Смотреть все →
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Wrapper>
  );
};
