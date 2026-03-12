import { Link } from "react-router-dom";
import { Button } from "../../shared/ui/Button";
import { Title } from "../../shared/ui/Title/indext";
import { Wrapper } from "../../shared/ui/Wrapper";
import classes from "./about-info.module.scss";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const imageReveal = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const listStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const itemSoft = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export const AboutInfo = () => {
  return (
    <Wrapper id="how-to-order" className={classes.wrapper}>
      <motion.div
        className={classes.content}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* ЛЕВАЯ КОЛОНКА */}
        <motion.div className={classes.left} variants={imageReveal}>
          <div className={classes.bl_image}>
            <img
              src="/assets/images/banner.webp"
              alt="Loftory — как заказать стол или табуретку в стиле Loft"
            />
          </div>
        </motion.div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className={classes.right}>
          <div className={classes.body}>
            {/* Заголовок */}
            <motion.div variants={fadeUp}>
              <Title className={classes.title} title="Как оформить заказ" />
            </motion.div>

            {/* Список шагов */}
            <motion.div className={classes.items} variants={listStagger}>
              <motion.div className={classes.item} variants={itemSoft}>
                <div className={classes.number}>1</div>
                <p className={classes.text_item}>
                  <strong>Выбираете модель</strong> → стол или табуретка в стиле Loft, нужный размер и цвет.
                </p>
              </motion.div>

              <motion.div className={classes.item} variants={itemSoft}>
                <div className={classes.number}>2</div>
                <p className={classes.text_item}>
                  <strong>Оставляете заявку</strong> → мы уточним детали и подтвердим стоимость.
                  <br />
                  <span>У всех моделей есть <strong>регулировка ножек</strong>.</span>
                </p>
              </motion.div>

              <motion.div className={classes.item} variants={itemSoft}>
                <div className={classes.number}>3</div>
                <p className={classes.text_item}>
                  <strong>Оплата и доставка</strong> → наличные/перевод или <strong>рассрочка через карту Salom</strong>.
                  Доставим по Душанбе в удобное время.
                </p>
              </motion.div>
            </motion.div>

            {/* Кнопка */}
            <motion.div variants={fadeUp}>
              <div className={classes.button_body}>
                <Link to="/products">
                  <Button buttonSize="medium" className={classes.button}>
                    Перейти в каталог
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Wrapper>
  );
};
