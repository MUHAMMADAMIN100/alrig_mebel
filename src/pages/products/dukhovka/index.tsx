import { Product } from "../../../widgets/products/product";

export const DukhovkaPage = () => {
  return (
    <Product
      title="Духовка"
      priceFrom={1000}
      badges={["В наличии", "Рассрочка Salom"]}
      images={[
        "/assets/products/dukhovka/dukhovka black.png",
        "/assets/products/dukhovka/dukhovka brown.png",
        "/assets/products/dukhovka/dukhovka black by id.png",
        "/assets/products/dukhovka/dukhovka brown by id.png",
        "/assets/products/dukhovka/dikhovka by id black.png",
        "/assets/products/dukhovka/dulhovka blackk.png",
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
