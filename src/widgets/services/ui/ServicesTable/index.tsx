import { Link } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button';
import { IService } from '../../model/services';
import classes from './services-table.module.scss';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface Props {
  services?: IService[] | null;
}

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

export const ServicesTable = ({ services }: Props) => {
  if (!services) return null;

  return (
    <motion.div
      className={classes.items}
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      {services.map((service) => (
        <motion.div
          key={service.id}
          className={classes.m_item}
          variants={itemVariants}
        >
          <div className={classes.body}>
            <img
              src={service.image}
              width={50}
              height={50}
              alt="about us"
            />
          </div>

          <div className={classes.content}>
            <div className={classes.text_content}>
              <div className={classes.content_body}>
                <h3 className={classes.m_title}>{service.name}</h3>
                <p className={classes.m_text}>{service.description}</p>
              </div>

              <div className={clsx(classes.item, classes.price)}>
                <p>{service.price} сомони</p>
                <div className={clsx(classes.item, classes.duration)}>
                  {/* <Time width={16} height={16} /> */}
                  {/* <p>{service.duration}</p> */}
                </div>
              </div>
            </div>

            <div className={classes.button_body}>
              <Button
                className={classes.button}
                buttonSize="small"
                fullWidth
                component={Link}
                onClick={(event) => {
                  event.preventDefault();
                  (window as any).openSabtModal &&
                    (window as any).openSabtModal();
                }}
              >
                Записаться
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
