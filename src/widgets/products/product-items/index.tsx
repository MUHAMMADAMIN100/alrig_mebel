import { Link } from "react-router-dom";
import classes from "./product-items.module.scss";

type ProductCard = {
  id: string;
  slug: string;
  title: string;
  size: string;
  priceFrom: number;
  image: string;
  badges: string[];
};

const products: ProductCard[] = [
  {
    id: "l-120",
    slug: "loft-120",
    title: "Рабочий стол Loft (120 см)",
    size: "120×60×75 см",
    priceFrom: 1200,
    image: "/assets/products/l/1.webp",
    badges: ["Хит", "Регулировка ножек", "Рассрочка Salom"],
  },
  {
    id: "k-120",
    slug: "loft-k-120",
    title: "Кухонный стол Loft (120 см)",
    size: "120×60×75 см",
    priceFrom: 1200,
    image: "/assets/products/k/1.webp",
    badges: ["В наличии", "Регулировка ножек", "Loft"],
  },
  {
    id: "r-80",
    slug: "loft-r-80",
    title: "Круглый стол Loft (Ø80 см)",
    size: "Ø80×75 см",
    priceFrom: 1200,
    image: "/assets/products/r/1.webp",
    badges: ["Круглый", "Регулировка ножек", "Рассрочка Salom"],
  },
  {
    id: "stool",
    slug: "loft-t-45",
    title: "Табуретка Loft (45 см)",
    size: "35×35×45 см",
    priceFrom: 350,
    image: "/assets/products/t/1.webp",
    badges: ["Комплектом выгоднее", "Loft"],
  },
];


export const ProductItems = () => {
  return (
    <div className={classes.product}>
      <div className={classes.grid}>
        {products.map((p) => (
          <Link key={p.id} to={`/products/${p.slug}`} className={classes.card}>
            <div className={classes.imageWrap}>
              <img
                className={classes.image}
                src={p.image}
                alt={`${p.title} — ${p.size}`}
                loading="lazy"
              />
              {/* <div className={classes.badges}>
                {p.badges.slice(0, 3).map((b) => (
                  <span key={b} className={classes.badge}>
                    {b}
                  </span>
                ))}
              </div> */}
            </div>

            <div className={classes.body}>
              <div className={classes.top}>
                <h3 className={classes.title}>{p.title}</h3>
                <p className={classes.text}>{p.size}</p>
              </div>

              <div className={classes.item_bottom}>
                <div className={classes.price}>
                  {/* <span className={classes.priceLabel}>Стоимость</span> */}
                  <span className={classes.priceValue}>
                    {p.priceFrom.toLocaleString()}
                  </span>
                  <span className={classes.priceCurrency}>сомони</span>
                </div>

                <span className={classes.more}>Подробнее →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
