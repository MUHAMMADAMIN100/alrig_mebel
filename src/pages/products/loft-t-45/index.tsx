import { Product } from "../../../widgets/products/product";

export const LoftT45Page = () => {
  return (
    <Product
      title="Табурет Loft"
      subtitle="35×35×45 см"
      priceFrom={350}
      badges={["Компактный", "Loft стиль", "Рассрочка Salom"]}
      images={[
        "/assets/products/t/1.webp",
        "/assets/products/t/2.webp",
        "/assets/products/t/3.webp",
        "/assets/products/t/4.webp",
      ]}
      youtubeId="vALk2srE-YE"
      youtubeTitle="Обзор табурета Loft"
      description={
        "Минималистичный табурет в стиле Loft.\n" +
        "Прочный металлический каркас и износостойкая столешница.\n" +
        "Подходит для кухни, мастерской и коммерческих пространств."
      }
      specs={[
        { label: "Размер", value: "35×35×45 см" },
        { label: "Назначение", value: "Табурет" },
        { label: "Столешница", value: "ЛДСП (износостойкая)" },
        { label: "Каркас", value: "Металл" },
        { label: "Регулировка ножек", value: "Есть" },
        { label: "Оплата", value: "Наличные / перевод / рассрочка Salom" },
      ]}
      phone="975 20 51 15"
    />
  );
};
