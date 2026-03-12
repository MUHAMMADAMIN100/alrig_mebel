import { Product } from "../../../widgets/products/product";

export const LoftK120Page = () => {
  return (
    <Product
      title="Кухонный стол Loft K-120"
      subtitle="120×70×75 см"
      priceFrom={1250}
      badges={["Для кухни", "Регулировка ножек", "Рассрочка Salom"]}
      images={[
        "/assets/products/k/1.webp",
        "/assets/products/k/2.webp",
        "/assets/products/k/3.webp",
        "/assets/products/k/4.webp",
      ]}
      youtubeId="Le1t4O1xpKc"
      youtubeTitle="Обзор кухонного стола Loft K-120"
      description={
        "Практичный кухонный стол в стиле Loft для ежедневного использования.\n" +
        "Устойчивый металлический каркас и легко очищаемая столешница.\n" +
        "Подходит для дома, кухни и студий."
      }
      specs={[
        { label: "Размер", value: "120×70×75 см" },
        { label: "Назначение", value: "Кухонный стол" },
        { label: "Столешница", value: "ЛДСП (износостойкая, легко очищается)" },
        { label: "Каркас", value: "Металл" },
        { label: "Регулировка ножек", value: "Есть" },
        { label: "Оплата", value: "Наличные / перевод / рассрочка Salom" },
      ]}
      phone="975 20 51 15"
    />
  );
};
