import { Product } from "../../../widgets/products/product";

export const MicrowavePage = () => {
  return (
    <Product
      title="Микроволновая печь"
      subtitle="Чёрный цвет"
      priceFrom={600}
      badges={["В наличии", "Рассрочка Salom"]}
      images={[
        "/assets/products/microvawe/h1.jpg",
      ]}
      description={
        "Микроволновая печь в чёрном цвете.\n" +
        "Уточняйте наличие и цену по телефону."
      }
      specs={[
        { label: "Цвет", value: "Чёрный" },
        { label: "Оплата", value: "Наличные / перевод / рассрочка Salom" },
      ]}
      phone="975 20 51 15"
    />
  );
};
