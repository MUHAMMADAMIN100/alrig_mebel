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
  // ───────────────────────────── 1. СТИРАЛЬНЫЕ МАШИНЫ ─────────────────────────────
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
        description:
          'Стиральная машина 10 кг с инверторным двигателем BLDC. Тихая и экономичная.',
      },
    ],
  },

  // ───────────────────────────── 2. МИКРОВОЛНОВЫЕ ПЕЧИ ─────────────────────────────
  {
    id: 'microwave',
    slug: 'microwave',
    name: 'Микроволновые печи',
    coverImage: '/assets/products/microvawe/1.jpg',
    products: [
      {
        id: 'mw-b20mxp07-silver',
        title: 'Микроволновая печь ALRIG B20MXP07',
        subtitle: 'Серебристый цвет / 20 л',
        priceFrom: 850,
        images: ['/assets/products/microvawe/1.jpg'],
        badges: ['В наличии', 'Гарантия 5 лет', 'Рассрочка Salom'],
        specs: [
          { label: 'Модель', value: 'B20MXP07' },
          { label: 'Объём', value: '20 литров' },
          { label: 'Мощность', value: '700 Вт' },
          { label: 'Напряжение', value: '220–240 В / 50 Гц' },
          { label: 'Управление', value: 'Механическое (поворотные ручки)' },
          { label: 'Цвет', value: 'Серебристый' },
          { label: 'Гарантия', value: '5 лет' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Микроволновая печь ALRIG B20MXP07 объёмом 20 литров и мощностью 700 Вт. Идеально подходит для разогрева, размораживания и приготовления блюд. Удобное механическое управление, стильный серебристый дизайн. Гарантия производителя — 5 лет.',
      },
      {
        id: 'mw-b20mxp07-black',
        title: 'Микроволновая печь ALRIG B20MXP07',
        subtitle: 'Чёрный цвет / 20 л',
        priceFrom: 850,
        images: [
          '/assets/products/microvawe/2.jpg',
          '/assets/products/microvawe/h1.jpg',
        ],
        badges: ['В наличии', 'Гарантия 5 лет', 'Рассрочка Salom'],
        specs: [
          { label: 'Модель', value: 'B20MXP07' },
          { label: 'Объём', value: '20 литров' },
          { label: 'Мощность', value: '700 Вт' },
          { label: 'Напряжение', value: '220–240 В / 50 Гц' },
          { label: 'Управление', value: 'Механическое (поворотные ручки)' },
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Гарантия', value: '5 лет' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Микроволновая печь ALRIG B20MXP07 в стильном чёрном исполнении. Объём 20 литров, мощность 700 Вт, удобное механическое управление. Гарантия 5 лет.',
      },
    ],
  },

  // ───────────────────────────── 3. ХОЛОДИЛЬНИКИ ─────────────────────────────
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

  // ───────────────────────────── 4. ДУХОВЫЕ ШКАФЫ ─────────────────────────────
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
        description:
          'Духовой шкаф в чёрном цвете. Отлично подходит для выпечки и запекания.',
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

  // ───────────────────────────── 5. УТЮГИ ─────────────────────────────
  {
    id: 'utyug',
    slug: 'utyug',
    name: 'Утюги',
    coverImage: '/assets/products/utyug/4.jpg',
    products: [
      {
        id: 'iron-sfb1991',
        title: 'Паровой утюг ALRIG Steam Iron',
        subtitle: 'S.F.B 1991 / 3000 Вт',
        priceFrom: 550,
        images: ['/assets/products/utyug/4.jpg'],
        badges: ['В наличии', 'Гарантия 5 лет', 'Рассрочка Salom'],
        specs: [
          { label: 'Модель', value: 'S.F.B 1991' },
          { label: 'Мощность', value: '3000 Вт' },
          { label: 'Резервуар воды', value: '350 мл' },
          { label: 'Подошва', value: 'Керамическая (Ceramic Soleplate)' },
          { label: 'Функции', value: 'Спрей / пар / паровой удар / вертикальный пар' },
          { label: 'Защита от накипи', value: 'Anti Calc' },
          { label: 'Защита от капель', value: 'Drip Stop' },
          { label: 'Регулировка температуры', value: 'Плавная' },
          { label: 'Подходит для', value: 'Всех типов тканей' },
          { label: 'Гарантия', value: '5 лет' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Мощный паровой утюг ALRIG S.F.B 1991 с керамической подошвой. Большой резервуар на 350 мл, мощность 3000 Вт. Подходит для всех типов тканей. Функции: спрей, пар, паровой удар, вертикальный пар, защита от накипи Anti Calc и защита от капель Drip Stop. Гарантия 5 лет.',
      },
    ],
  },

  // ───────────────────────────── 6. ЭЛЕКТРИЧЕСКИЕ ЧАЙНИКИ ─────────────────────────────
  {
    id: 'chaynik',
    slug: 'chaynik',
    name: 'Электрические чайники',
    coverImage: '/assets/products/chaynik/5.jpg',
    products: [
      {
        id: 'kettle-sfb1991',
        title: 'Электрический чайник ALRIG',
        subtitle: 'S.F.B 1991 / 2 л',
        priceFrom: 450,
        images: ['/assets/products/chaynik/5.jpg'],
        badges: ['В наличии', 'Гарантия 3 года', 'Рассрочка Salom'],
        specs: [
          { label: 'Модель', value: 'S.F.B 1991' },
          { label: 'Объём', value: '2 литра' },
          { label: 'Мощность', value: '2000 Вт' },
          { label: 'Материал корпуса', value: 'Нержавеющая сталь SUS 304' },
          { label: 'Быстрый нагрев', value: 'Да' },
          { label: 'Автоотключение', value: 'Да' },
          { label: 'Контроль температуры', value: 'Точный' },
          { label: 'Гарантия', value: '3 года' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Электрический чайник ALRIG S.F.B 1991 с быстрым нагревом. Корпус из нержавеющей стали SUS 304, объём 2 литра, мощность 2000 Вт. Точный контроль температуры и автоматическое отключение. Гарантия 3 года.',
      },
    ],
  },

  // ───────────────────────────── 7. ТЕРМОСЫ ─────────────────────────────
  {
    id: 'termos',
    slug: 'termos',
    name: 'Термосы',
    coverImage: '/assets/products/termos/3.jpg',
    products: [
      {
        id: 'vacuum-jug-sfb1991',
        title: 'Термос ALRIG Vacuum Jug',
        subtitle: 'S.F.B 1991 / 2 л / NEW 2026',
        priceFrom: 350,
        images: ['/assets/products/termos/3.jpg'],
        badges: ['В наличии', 'NEW 2026', 'Гарантия 3 года'],
        specs: [
          { label: 'Модель', value: 'S.F.B 1991' },
          { label: 'Объём', value: '2 литра' },
          { label: 'Материал', value: 'Нержавеющая сталь Inox' },
          { label: 'Корпус', value: 'Небьющийся (Unbreakable)' },
          { label: 'Ручка', value: 'Удобный хват, термостойкая' },
          { label: 'Качество', value: 'Quality Assurance Guarantee' },
          { label: 'Гарантия', value: '3 года' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Термос ALRIG Vacuum Jug S.F.B 1991 объёмом 2 литра. Корпус из нержавеющей стали Inox — небьющийся и долговечный. Удобная термостойкая ручка с удобным хватом. Долго сохраняет температуру напитков. Новая модель 2026 года. Гарантия качества 3 года.',
      },
    ],
  },

  // ───────────────────────────── 8. ВЫТЯЖКИ ─────────────────────────────
  {
    id: 'vityazhka',
    slug: 'vityazhka',
    name: 'Вытяжки',
    coverImage: '/assets/products/vityazhka/6.jpg',
    products: [
      {
        id: 'hood-alrig-display',
        title: 'Кухонная вытяжка ALRIG',
        subtitle: 'Сенсорный дисплей / LED',
        priceFrom: 1500,
        images: ['/assets/products/vityazhka/6.jpg'],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Тип', value: 'Подвесная' },
          { label: 'Управление', value: 'Сенсорный дисплей' },
          { label: 'Подсветка', value: 'LED, 2 лампы' },
          { label: 'Фильтр', value: 'Алюминиевый, моющийся' },
          { label: 'Материал корпуса', value: 'Сталь с покрытием' },
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Кухонная вытяжка ALRIG с современным сенсорным дисплеем и яркой LED-подсветкой (2 лампы). Чёрный корпус, алюминиевые моющиеся фильтры. Эффективно очищает воздух на кухне.',
      },
      {
        id: 'hood-alrig-1200',
        title: 'Кухонная вытяжка ALRIG',
        subtitle: 'Классическая чёрная',
        priceFrom: 1200,
        images: ['/assets/products/vityazhka/8.jpg'],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Тип', value: 'Подвесная' },
          { label: 'Управление', value: 'Кнопочное' },
          { label: 'Подсветка', value: 'LED, 2 лампы' },
          { label: 'Фильтр', value: 'Алюминиевый, моющийся' },
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Кухонная вытяжка ALRIG в классическом чёрном исполнении. Простое кнопочное управление, LED-подсветка, моющиеся алюминиевые фильтры. Базовая модель с надёжной работой.',
      },
      {
        id: 'hood-alrig-glass',
        title: 'Наклонная вытяжка ALRIG',
        subtitle: 'Со стеклянным экраном',
        priceFrom: 1800,
        images: ['/assets/products/vityazhka/10.jpg'],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Тип', value: 'Наклонная со стеклом' },
          { label: 'Управление', value: 'Сенсорное' },
          { label: 'Подсветка', value: 'LED' },
          { label: 'Фильтр', value: 'Алюминиевый, моющийся' },
          { label: 'Цвет', value: 'Чёрный со стеклом' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Стильная наклонная вытяжка ALRIG со стеклянным экраном. Современный дизайн идеально подходит для просторных кухонь. Сенсорное управление и LED-подсветка.',
      },
      {
        id: 'hood-alrig-built-in',
        title: 'Встраиваемая вытяжка ALRIG',
        subtitle: 'Телескопическая',
        priceFrom: 3000,
        images: ['/assets/products/vityazhka/14.jpg'],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Тип', value: 'Встраиваемая (телескопическая)' },
          { label: 'Управление', value: 'Сенсорное' },
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Установка', value: 'В кухонный шкаф' },
          { label: 'Подсветка', value: 'LED' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Встраиваемая телескопическая вытяжка ALRIG для скрытой установки в кухонный шкаф. Современное сенсорное управление, чёрный корпус. Отличное решение для аккуратного дизайна кухни.',
      },
      {
        id: 'hood-gorenj',
        title: 'Кухонная вытяжка Gorenj',
        subtitle: 'С прозрачным фильтром',
        priceFrom: 1600,
        images: ['/assets/products/vityazhka/7.jpg'],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Бренд', value: 'Gorenj' },
          { label: 'Тип', value: 'Подвесная' },
          { label: 'Управление', value: 'Сенсорное' },
          { label: 'Фильтр', value: 'Прозрачный, моющийся' },
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Вытяжка Gorenj с прозрачным моющимся фильтром и сенсорным управлением. Современный дизайн.',
      },
    ],
  },

  // ───────────────────────────── 9. ВАРОЧНЫЕ ПАНЕЛИ ─────────────────────────────
  {
    id: 'varochnaya-panel',
    slug: 'varochnaya-panel',
    name: 'Варочные панели',
    coverImage: '/assets/products/varochnaya/13.jpg',
    products: [
      {
        id: 'cooktop-gas-glass-3800',
        title: 'Газовая варочная панель ALRIG',
        subtitle: '4 газовые конфорки / стекло',
        priceFrom: 3800,
        images: ['/assets/products/varochnaya/13.jpg'],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Тип', value: 'Газовая' },
          { label: 'Конфорки', value: '4 газовые' },
          { label: 'Поверхность', value: 'Закалённое стекло' },
          { label: 'Управление', value: 'Поворотные ручки' },
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Установка', value: 'Встраиваемая' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Газовая варочная панель ALRIG с 4 газовыми конфорками на стеклянной поверхности. Стильный чёрный дизайн, удобные поворотные ручки управления. Встраиваемая модель.',
      },
      {
        id: 'cooktop-combo-glass',
        title: 'Комбинированная варочная панель ALRIG',
        subtitle: '2 газа + 2 электро / стекло',
        priceFrom: 3500,
        images: ['/assets/products/varochnaya/11.jpg'],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Тип', value: 'Комбинированная (газ + электро)' },
          { label: 'Конфорки', value: '2 газовые + 2 электрические' },
          { label: 'Поверхность', value: 'Закалённое стекло' },
          { label: 'Управление', value: 'Поворотные ручки' },
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Установка', value: 'Встраиваемая' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Комбинированная варочная панель ALRIG со стеклянной поверхностью: 2 газовые и 2 электрические конфорки. Универсальное решение для любой кухни.',
      },
      {
        id: 'cooktop-combo-steel',
        title: 'Комбинированная варочная панель ALRIG',
        subtitle: '2 газа + 2 электро / нержавейка',
        priceFrom: 3200,
        images: ['/assets/products/varochnaya/9.jpg'],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Тип', value: 'Комбинированная (газ + электро)' },
          { label: 'Конфорки', value: '2 газовые + 2 электрические' },
          { label: 'Поверхность', value: 'Нержавеющая сталь' },
          { label: 'Управление', value: 'Поворотные ручки' },
          { label: 'Установка', value: 'Встраиваемая' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Прочная комбинированная варочная панель ALRIG из нержавеющей стали. 2 газовые и 2 электрические конфорки. Долговечная и надёжная.',
      },
      {
        id: 'cooktop-electric-coil',
        title: 'Электрическая варочная панель ALRIG',
        subtitle: '4 чугунные конфорки',
        priceFrom: 2400,
        images: ['/assets/products/varochnaya/12.jpg'],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Тип', value: 'Электрическая' },
          { label: 'Конфорки', value: '4 чугунные (блин)' },
          { label: 'Поверхность', value: 'Эмаль' },
          { label: 'Управление', value: 'Поворотные ручки' },
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Установка', value: 'Встраиваемая' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Электрическая варочная панель ALRIG с 4 классическими чугунными конфорками. Надёжная и долговечная. Простое управление поворотными ручками.',
      },
      {
        id: 'cooktop-ceramic',
        title: 'Стеклокерамическая варочная панель ALRIG',
        subtitle: '4 зоны нагрева / сенсор',
        priceFrom: 2800,
        images: ['/assets/products/varochnaya/15.jpg'],
        badges: ['В наличии', 'Рассрочка Salom'],
        specs: [
          { label: 'Тип', value: 'Электрическая стеклокерамика' },
          { label: 'Зоны нагрева', value: '4' },
          { label: 'Поверхность', value: 'Стеклокерамика' },
          { label: 'Управление', value: 'Сенсорное' },
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Установка', value: 'Встраиваемая' },
          { label: 'Оплата', value: 'Наличные / перевод / рассрочка Salom' },
        ],
        description:
          'Современная стеклокерамическая варочная панель ALRIG с 4 зонами нагрева и сенсорным управлением. Лёгкая в чистке, стильный внешний вид.',
      },
    ],
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);
