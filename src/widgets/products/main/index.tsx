import { Link } from 'react-router-dom';
import { Wrapper } from '../../../shared/ui/Wrapper';
import { categories } from '../../../data/products';
import classes from './main.module.scss';

export const Products = () => {
  return (
    <Wrapper>
      <div className={classes.header}>
        <h1 className={classes.title}>Каталог товаров</h1>
        <p className={classes.subtitle}>Выберите категорию бытовой техники</p>
      </div>
      <div className={classes.grid}>
        {categories.map((cat) => (
          <Link key={cat.id} to={`/products/${cat.slug}`} className={classes.card}>
            <div className={classes.imageWrap}>
              <img
                className={classes.image}
                src={cat.coverImage}
                alt={cat.name}
                loading="lazy"
              />
            </div>
            <div className={classes.cardBody}>
              <h2 className={classes.cardTitle}>{cat.name}</h2>
              <p className={classes.cardCount}>
                {cat.products.length} {cat.products.length === 1 ? 'модель' : 'модели'}
              </p>
              <span className={classes.cardLink}>Смотреть →</span>
            </div>
          </Link>
        ))}
      </div>
    </Wrapper>
  );
};
