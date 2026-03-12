import { Wrapper } from "../../shared/ui/Wrapper";
import { Title } from "../../shared/ui/Title/indext";
import classes from "./payment-info.module.scss";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const listStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemSoft = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const PaymentInfo = () => {
  return (
    <Wrapper id="payment" className={classes.wrapper}>
      <motion.div
        className={classes.content}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Заголовок */}
        <motion.div variants={fadeUp}>
          <Title className={classes.title} title="Оплата и рассрочка" />
        </motion.div>

        {/* Описание */}
        <motion.p className={classes.subtitle} variants={fadeUp}>
          Работаем с частными и корпоративными заказами. Все способы оплаты — безопасные и удобные.
          Обычно предоплата составляет <strong>50%</strong>, остальное — при получении/доставке.
        </motion.p>

        {/* Список вариантов оплаты */}
        <motion.div className={classes.list} variants={listStagger}>
          <motion.div className={classes.item} variants={itemSoft}>
            <div className={classes.icon} />
            <p className={classes.text}>
              <strong>Рассрочка через карту Salom.&nbsp;</strong>
              Оформление быстро, оплата частями.
            </p>
          </motion.div>

          <motion.div className={classes.item} variants={itemSoft}>
            <div className={classes.icon} />
            <p className={classes.text}>
              <strong>Перевод на карту / по реквизитам.&nbsp;</strong>
              Отправим сумму и данные одним сообщением.
            </p>
          </motion.div>

          <motion.div className={classes.item} variants={itemSoft}>
            <div className={classes.icon} />
            <p className={classes.text}>
              <strong>Наличными.&nbsp;</strong>
              Оплата при получении или при самовывозе (если доступно).
            </p>
          </motion.div>

          <motion.div className={classes.item} variants={itemSoft}>
            <div className={classes.icon} />
            <p className={classes.text}>
              <strong>По счёту для бизнеса.&nbsp;</strong>
              Для организаций и ИП (если нужно — подготовим документы).
            </p>
          </motion.div>
        </motion.div>

        <motion.p className={classes.note} variants={fadeUp}>
          Не знаете, что выбрать? Напишите нам — подскажем самый удобный вариант и поможем оформить рассрочку.
        </motion.p>
      </motion.div>
    </Wrapper>
  );
};
