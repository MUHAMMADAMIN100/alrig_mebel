import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation as SwiperNavigation, Autoplay } from 'swiper/modules'; // подключаем Autoplay
import { Title } from "../../shared/ui/Title/indext";
import { Wrapper } from "../../shared/ui/Wrapper";
import classes from './team.module.scss';
import { Subtitle } from '../../shared/ui/Subtitle/indext';
import SliderNav from '../../shared/ui/SliderNav/SliderNav';
import { motion } from 'framer-motion';

interface ITeam {
  id: number
  name: string
  image: string
  specialty: string
}

const TestData: ITeam[] = [
  { id: 1, name: 'Махин Умеди', specialty: 'Психолог, Руководитель центра',   image: '/assets/images/mahin.webp' },
  { id: 3, name: 'Идигуль Шанбиева', specialty: 'Педагог-психолог, нейропсихолог', image: '/assets/images/shanbieva.jpg' },
  { id: 2, name: 'Анахита Бобозода', specialty: 'Психолог, специалист по сенсорной интеграции', image: '/assets/images/bobozoda.webp' },
  { id: 4, name: 'Зумрад Косими', specialty: 'Специалист по нейросенсорной коррекции и АВА терапии ', image: '/assets/images/zumrad.webp' },
  { id: 3, name: 'Мадина Хадзиева', specialty: 'Логопед-дефектолог', image: '/assets/images/madina.jpg' },
  // { id: 4, name: 'Mahin Umedi', specialty: 'Логопед-дефектолог', image: '/assets/images/team_1.jpg' },
];

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const cardSpring = {
  hidden:  { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 160, damping: 20 } }
};

export const Team = () => {
  return (
    <div id='team' className={classes.wrapper_main}>
      <Wrapper>
        <div className={classes.team}>
          <div className={classes.header}>
            <div className={classes.title_content}>
              <Title className={classes.title} title="Команда" />
              <div className={classes.nav_content_mobile}>
                  <SliderNav
                    className={classes.nav_buttons}
                    prevId="team-nav-prev"
                    nextId="team-nav-next"
                    theme='light'
                  />
              </div>
            </div>
            <div className={classes.right}>
              <Subtitle
                className={classes.subtitle}
                subtitle='Задача специалиста — поддержать ребёнка в развитии и родителей в пути'
              />
              <div className={classes.nav_content}>
                <SliderNav
                  className={classes.nav_buttons}
                  prevId="team-nav-prev"
                  nextId="team-nav-next"
                  theme='light'
                />
              </div>
            </div>
          </div>

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Swiper
              className={classes.Swiper}
              navigation={{ enabled: true, nextEl: '#team-nav-next', prevEl: '#team-nav-prev' }}
              slidesPerView={2}
              spaceBetween={16}
              modules={[SwiperNavigation, Autoplay]}   // добавили сюда Autoplay
              autoplay={{
                delay: 3000,      // задержка между слайдами 3 сек
                disableOnInteraction: false // автоплей не выключается после ручного листания
              }}
              // loop={true}         // чтобы после конца снова начиналось
              breakpoints={{
                768: { spaceBetween: 24, slidesPerView: 4 }
              }}
            >
              {TestData.map(({ image, id, name, specialty }) => (
                <SwiperSlide key={id} className={classes.Slide}>
                  <motion.div className={classes.item} variants={cardSpring}>
                    <div className={classes.bl_img}>
                      <img src={image} alt={name} />
                    </div>
                    <p className={classes.name}>{name}</p>
                    <p className={classes.specialty}>{specialty}</p>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </Wrapper>
    </div>
  );
};
