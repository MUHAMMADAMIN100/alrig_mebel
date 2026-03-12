import { Product } from "../../../widgets/products/product";

export const LoftR80Page = () => {
  return (
    <Product
      title="Круглый стол Loft R-80"
      subtitle="Ø80×75 см"
      priceFrom={1100}
      badges={["Компактный", "Регулировка ножек", "Рассрочка Salom"]}
      images={[
        "/assets/products/r/1.webp",
        "/assets/products/r/2.webp",
        "/assets/products/r/3.webp",
        "/assets/products/r/4.webp",
      ]}
      youtubeId="m5OScy8PSdM"
      youtubeTitle="Обзор круглого стола Loft R-80"
      description={
        "Круглый стол в стиле Loft — идеально для кухни и небольших пространств.\n" +
        "Прочный металлический каркас и износостойкая столешница.\n" +
        "Доступен выбор цвета и комплектации."
      }
      specs={[
        { label: "Форма", value: "Круглый" },
        { label: "Диаметр", value: "80 см" },
        { label: "Высота", value: "75 см" },
        { label: "Столешница", value: "ЛДСП (износостойкая)" },
        { label: "Каркас", value: "Металл" },
        { label: "Регулировка ножек", value: "Есть" },
        { label: "Оплата", value: "Наличные / перевод / рассрочка Salom" },
      ]}
      phone="975 20 51 15"
    />
  );
};
