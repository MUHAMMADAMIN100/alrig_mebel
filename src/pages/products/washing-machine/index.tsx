import { Product } from "../../../widgets/products/product";

export const WashingMachinePage = () => {
  return (
    <Product
      title="Стиральная машина"
      subtitle="6 кг"
      priceFrom={1800}
      badges={["В наличии", "Рассрочка Salom"]}
      images={[
        "/assets/products/washing machine/washing machine 6kg.png",
        "/assets/products/washing machine/washing mascine.png",
      ]}
      description={
        "Стиральная машина с загрузкой 6 кг.\n" +
        "Доступна в нескольких моделях.\n" +
        "Уточняйте наличие и цену по телефону."
      }
      specs={[
        { label: "Загрузка", value: "6 кг" },
        { label: "Оплата", value: "Наличные / перевод / рассрочка Salom" },
      ]}
      phone="975 20 51 15"
    />
  );
};
