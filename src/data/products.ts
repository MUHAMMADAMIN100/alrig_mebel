export type ProductSpec = { label: string; value: string };

export type CatalogProduct = {
  id: string;
  title: string;
  subtitle?: string;
  priceFrom?: number;
  currency?: string;
  images: string[];
  specs: ProductSpec[];
  badges?: string[];
  description?: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  coverImage: string;
  products: CatalogProduct[];
};

export const categories: Category[] = [
  {
    id: 'washing-machine',
    slug: 'washing-machine',
    name: 'Стиральные машины',
    coverImage: '/assets/products/washing machine/mini-m2.jpg',
    products: [
      {
        id: 'wm-6kg',
        title: 'Стиральная машина',
        subtitle: '6 кг',
        priceFrom: 1800,
        images: [
          '/assets/products/washing machine/mini-m2.jpg',
          '/assets/products/washing machine/Market 1.png',
          '/assets/products/washing machine/Market 1 1.png',
        ],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Загрузка', value: '6 кг' },
          { label: 'Тип загрузки', value: 'Фронтальная' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description: 'Стиральная машина с загрузкой 6 кг. Надёжная техника для семьи.',
      },
      {
        id: 'wm-10kg',
        title: 'Стиральная машина',
        subtitle: '10 кг / BLDC Inverter',
        priceFrom: 2400,
        images: [
          '/assets/products/washing machine/mini-m1.jpg',
          '/assets/products/washing machine/Market 1 1.png',
        ],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Загрузка', value: '10 кг' },
          { label: 'Двигатель', value: 'BLDC Inverter' },
          { label: 'Тип загрузки', value: 'Фронтальная' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description: 'Стиральная машина 10 кг с инверторным двигателем BLDC. Тихая и экономичная.',
      },
    ],
  },
  {
    id: 'microwave',
    slug: 'microwave',
    name: 'Микроволновые печи',
    coverImage: '/assets/products/microvawe/h1.jpg',
    products: [
      {
        id: 'mw-black',
        title: 'Микроволновая печь',
        subtitle: 'Чёрный цвет',
        priceFrom: 600,
        images: ['/assets/products/microvawe/h1.jpg'],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description: 'Микроволновая печь в стильном чёрном цвете. Удобная и компактная.',
      },
    ],
  },
  {
    id: 'kholodilnik',
    slug: 'kholodilnik',
    name: 'Холодильники',
    coverImage: '/assets/products/kholodilnik/mini-b.jpg',
    products: [
      {
        id: 'fridge-white',
        title: 'Холодильник',
        subtitle: 'Белый',
        priceFrom: 2500,
        images: [
          '/assets/products/kholodilnik/b1.jpg',
          '/assets/products/kholodilnik/b2.jpg',
        ],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Цвет', value: 'Белый' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description: 'Холодильник в белом цвете. Надёжный и вместительный.',
      },
    ],
  },
  {
    id: 'dukhovka',
    slug: 'dukhovka',
    name: 'Духовые шкафы',
    coverImage: '/assets/products/dukhovka/mini-r.jpg',
    products: [
      {
        id: 'oven-black',
        title: 'Духовой шкаф',
        subtitle: 'Чёрный',
        priceFrom: 1000,
        images: [
          '/assets/products/dukhovka/c1.jpg',
          '/assets/products/dukhovka/c2.jpg',
        ],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description: 'Духовой шкаф в чёрном цвете. Отлично подходит для выпечки и запекания.',
      },
      {
        id: 'oven-brown',
        title: 'Духовой шкаф',
        subtitle: 'Коричневый',
        priceFrom: 1000,
        images: [
          '/assets/products/dukhovka/r1.jpg',
          '/assets/products/dukhovka/r2.jpg',
        ],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Цвет', value: 'Коричневый' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description: 'Духовой шкаф в коричневом цвете.',
      },
    ],
  },
  {
    id: 'utyug',
    slug: 'utyug',
    name: 'Утюги',
    coverImage: '/assets/icons/alrig_logoo.png',
    products: [
      {
        id: 'iron-1',
        title: 'Утюг',
        images: [],
        badges: ['В наличии'],
        specs: [
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description: 'Уточняйте наличие и цену по телефону: 975 20 51 15.',
      },
    ],
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);
