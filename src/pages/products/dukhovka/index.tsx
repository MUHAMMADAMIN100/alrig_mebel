import { Product } from "../../../widgets/products/product";

export const DukhovkaPage = () => {
  return (
    <Product
      title="Духовка"
      priceFrom={1000}
      badges={["В наличии", "Рассрочка Salom"]}
      images={[
        "/assets/products/dukhovka/c1.jpg",
        "/assets/products/dukhovka/c2.jpg",
        "/assets/products/dukhovka/e1.jpg",
        "/assets/products/dukhovka/e2.jpg",
        "/assets/products/dukhovka/r1.jpg",
        "/assets/products/dukhovka/r2.jpg",
      ]}
      description={
        "Духовка. Доступна в чёрном и коричневом цветах.\n" +
        "Уточняйте наличие и цену по телефону."
      }
      specs={[
        { label: "Цвет", value: "Чёрный / Коричневый" },
        { label: "Оплата", value: "Наличные / перевод / рассрочка Salom" },
      ]}
      phone="975 20 51 15"
    />
  );
};
