import { Link } from "react-router-dom";
import classes from "./product-items.module.scss";

type ProductCard = {
  id: string;
  slug: string;
  title: string;
  size?: string;
  priceFrom?: number;
  image: string;
  badges: string[];
};

const products: ProductCard[] = [
  {
    id: "washing-machine",
    slug: "washing-machine",
    title: "Стиральная машина",
    size: "6 кг",
    priceFrom: 1800,
    image: "/assets/products/washing machine/mini-m2.jpg",
    badges: ["В наличии", "Рассрочка Salom"],
  },
  {
    id: "washing-machine-10kg",
    slug: "washing-machine",
    title: "Стиральная машина",
    size: "10 кг / BLDC Inverter",
    priceFrom: 2400,
    image: "/assets/products/washing machine/mini-m1.jpg",
    badges: ["В наличии", "Рассрочка Salom"],
  },
  {
    id: "microwave",
    slug: "microwave",
    title: "Микроволновая печь",
    size: "Чёрный цвет",
    priceFrom: 600,
    image: "/assets/products/microvawe/h1.jpg",
    badges: ["В наличии", "Рассрочка Salom"],
  },
  {
    id: "kholodilnik",
    slug: "kholodilnik",
    title: "Холодильник",
    size: "Белый / Чёрный",
    priceFrom: 2500,
    image: "/assets/products/kholodilnik/mini-b.jpg",
    badges: ["В наличии", "Рассрочка Salom"],
  },
  {
    id: "dukhovka",
    slug: "dukhovka",
    title: "Духовка",
    size: "Чёрный / Коричневый",
    priceFrom: 1000,
    image: "/assets/products/dukhovka/mini-r.jpg",
    badges: ["В наличии", "Рассрочка Salom"],
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
                alt={`${p.title}${p.size ? ` — ${p.size}` : ""}`}
                loading="lazy"
              />
            </div>

            <div className={classes.body}>
              <div className={classes.top}>
                <h3 className={classes.title}>{p.title}</h3>
                {p.size && <p className={classes.text}>{p.size}</p>}
              </div>

              <div className={classes.item_bottom}>
                <div className={classes.price}>
                  {p.priceFrom ? (
                    <>
                      <span className={classes.priceValue}>
                        {p.priceFrom.toLocaleString()}
                      </span>
                      <span className={classes.priceCurrency}>сомони</span>
                    </>
                  ) : (
                    <span className={classes.priceValue}>Уточнить цену</span>
                  )}
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
