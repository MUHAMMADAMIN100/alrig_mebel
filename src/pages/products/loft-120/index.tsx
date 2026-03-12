import { Product } from "../../../widgets/products/product";

export const LoftL120Page = () => {
  return (
    <Product
      title="Рабочий стол Loft (120 см)"
      subtitle="120×60×75 см"
      priceFrom={1200}
      badges={["Хит", "Регулировка ножек", "Рассрочка Salom"]}
      images={[
        "/assets/products/l/1.webp",
        "/assets/products/l/2.webp",
        "/assets/products/l/3.webp",
        "/assets/products/l/4.webp",
      ]}
      youtubeId="edUJP6z7h6A"
      youtubeTitle="Обзор стола Loft 120 см"
      description={
        "Прочный стол в стиле Loft для работы и дома.\n" +
        "Металлический каркас, столешница ЛДСП, регулировка ножек.\n" +
        "Можно выбрать цвет и уточнить комплектацию."
      }
      specs={[
        { label: "Размер", value: "120×60×75 см" },
        { label: "Столешница", value: "ЛДСП (износостойкая)" },
        { label: "Каркас", value: "Металл" },
        { label: "Регулировка ножек", value: "Есть" },
        { label: "Оплата", value: "Наличные / перевод / рассрочка Salom" },
      ]}
      // orderLink="/order?product=loft-l-120"
      phone="975 20 51 15"
    />
  );
};
