// Banner.tsx
import { Link } from "react-router-dom";
import { Button } from "../../shared/ui/Button";
import { Wrapper } from "../../shared/ui/Wrapper";
import classes from "./banner.module.scss";
import RightIcon from "@icons/right.svg?react";
import { motion } from "framer-motion";

const leftStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const lineUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const heroImage = {
  hidden: { opacity: 0, x: 24, scale: 0.96, skewX: -4 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    skewX: 0,
    transition: { type: "spring", stiffness: 140, damping: 18, mass: 0.7 },
  },
};

export const Banner = () => {
  return (
    <Wrapper>
      <div className={classes.banner}>
        <motion.div
          className={classes.left}
          variants={leftStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.div className={classes.info} variants={lineUp}>
            <h1 className={classes.title}>
              Loftory — столы и табуретки в стиле Loft
            </h1>
          </motion.div>

          <motion.p className={classes.description} variants={lineUp}>
            Прочные столы из металла и ЛДСП для дома, офиса и заведений. 
            У всех моделей есть регулировка ножек. Рассрочка через карту Salom и доставка по Душанбе.
          </motion.p>

          <motion.div
            variants={lineUp}
            whileHover="hover"
            className={classes.buttonWrap}
          >
            <Link to="/products">
              <Button
                className={classes.button}
                buttonSize="medium"
                fullWidth
              >
                Посмотреть каталог
                <motion.span
                  className={classes.iconWrap}
                  initial={false}
                  animate={{}}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <RightIcon className={classes.icon} width={24} height={24} />
                </motion.span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className={classes.rigth}
          variants={heroImage}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <img
            className={classes.img}
            src={"./assets/images/banner.webp"}
            alt="Loftory — столы и табуретки в стиле Loft"
          />
        </motion.div>
      </div>
    </Wrapper>
  );
};
