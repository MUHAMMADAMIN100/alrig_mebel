import { Title } from "../../shared/ui/Title/indext";
import { Wrapper } from "../../shared/ui/Wrapper";
import { AboutInfo } from "../about-info";
import { PaymentInfo } from "../payment-info";
import classes from "./about.module.scss";
import { motion } from "framer-motion";

const abouts = [
  {
    id: 1,
    title: "Прочно и надолго",
    description:
      "Металлический каркас + износостойкая ЛДСП. Мебель выдерживает ежедневную нагрузку и выглядит стильно.",
    image: "/assets/icons/about-1.svg",
  },
  {
    id: 2,
    title: "Устойчивая установка",
    description:
      "У всех моделей есть регулировка ножек — стол стоит ровно даже на неровном полу.",
    image: "/assets/icons/about-2.svg",
  },
  {
    id: 3,
    title: "Удобная оплата и доставка",
    description:
      "Рассрочка через карту Salom, оплата наличными или переводом. Доставим по Душанбе в удобное время.",
    image: "/assets/icons/about-3.svg",
  },
];

// Контейнер с задержкой для stagger
const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

// Каждая карточка — zoom-in + fade
const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const About = () => {
  return (
    <div className={classes.wrapper}>
      <AboutInfo />
      <PaymentInfo />

      <Wrapper>
        <div className={classes.about}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={itemVariants}
          >
            <Title className={classes.title} title="Почему Loftory?" />
          </motion.div>

          <motion.div
            className={classes.items}
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {abouts.map((item) => (
              <motion.div
                key={item.id}
                className={classes.item}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {/* Если захочешь вернуть иконки — просто раскомментируй */}
                {/* <div className={classes.left}>
                  <img
                    className={classes.img}
                    src={item.image}
                    alt={item.title}
                    width={56}
                    height={56}
                  />
                </div> */}
                <div className={classes.right}>
                  <p className={classes.item_title}>{item.title}</p>
                  <p className={classes.item_text}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Wrapper>
    </div>
  );
};
