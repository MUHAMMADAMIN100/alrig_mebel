import { Product } from "../../../widgets/products/product";

export const KholodilnikPage = () => {
  return (
    <Product
      title="Холодильник"
      priceFrom={2500}
      badges={["В наличии", "Рассрочка Salom"]}
      images={[
        "/assets/products/kholodilnik/b1.jpg",
        "/assets/products/kholodilnik/b2.jpg",
      ]}
      description={
        "Холодильник. Доступен в нескольких цветах.\n" +
        "Уточняйте наличие и цену по телефону."
      }
      specs={[
        { label: "Цвет", value: "Белый / Чёрный" },
        { label: "Оплата", value: "Наличные / перевод / рассрочка Salom" },
      ]}
      phone="975 20 51 15"
    />
  );
};
