import classes from './price.module.scss'
import { useState, useEffect, useRef } from 'react'

type PriceProps = {
  targetPrice: number;
  duration: number;  // Длительность анимации в миллисекундах
}

export const AnimatedPrice: React.FC<PriceProps> = ({ targetPrice, duration }) => {
  const [price, setPrice] = useState(0);
  // актуальная цена в ref — чтобы эффект не перезапускался на каждый кадр
  const priceRef = useRef(price);
  priceRef.current = price;

  useEffect(() => {
    const startTime = performance.now();
    const initialPrice = priceRef.current;
    const priceDiff = targetPrice - initialPrice;
    let rafId: number;

    const animate = (time: number) => {
      const timeElapsed = time - startTime;
      const progress = Math.min(timeElapsed / duration, 1);  // Плавность (0 to 1)

      const currentPrice = Math.round(initialPrice + priceDiff * progress);
      setPrice(currentPrice);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [targetPrice, duration]);

  return <span className={classes.Span}>{price}с</span>;
};

export const Price = () => {

  const [selectedOptions] = useState<Record<string, number>>({});
  const total = Object.values(selectedOptions).reduce((sum, price) => sum + price, 0);

  return (
    <strong className={classes.price}>
        <AnimatedPrice targetPrice={total} duration={1000} />
    </strong>
  );
};
