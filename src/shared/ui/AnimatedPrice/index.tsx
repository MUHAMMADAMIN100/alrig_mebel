import classes from './price.module.scss'
import { useState, useEffect } from 'react'

type PriceProps = {
  targetPrice: number;
  duration: number;  // Длительность анимации в миллисекундах
}

export const AnimatedPrice: React.FC<PriceProps> = ({ targetPrice, duration }) => {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const initialPrice = price;
    const priceDiff = targetPrice - initialPrice;

    const animate = (time: number) => {
      const timeElapsed = time - startTime;
      const progress = Math.min(timeElapsed / duration, 1);  // Плавность (0 to 1)

      const currentPrice = Math.round(initialPrice + priceDiff * progress);
      setPrice(currentPrice);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetPrice, duration]);

  return <span className={classes.Span}>{price}с</span>;
};

export const Price = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedOptions] = useState<Record<string, number>>({});
  const total = Object.values(selectedOptions).reduce((sum, price) => sum + price, 0);

  return (
    <strong className={classes.price}>
        <AnimatedPrice targetPrice={total} duration={1000} />
    </strong>
  );
};
