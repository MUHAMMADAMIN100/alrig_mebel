/**
 * Единый конфиг контактов ALRIG.
 * Все контактные данные сайта правятся ТОЛЬКО здесь.
 */

export interface SocialLink {
  /** Подпись в UI */
  label: string
  /** Полная ссылка; пустая строка — ссылка скрыта в UI */
  href: string
}

export const CONTACTS = {
  /** Основной телефон (отображение и tel:-ссылка) */
  phone: {
    label: '+992 91 290 09 00',
    href: 'tel:+992912900900',
  },

  workingHours: 'Пн–Сб: 9:00 – 18:00',

  address: 'проспект Негмата Карабаева, 54/1, Душанбе',

  /** Центр карты и метка (магазин ALRIG) */
  mapCenter: [38.538432, 68.762671] as [number, number],
  mapZoom: 16,
  /** «Построить маршрут» — Яндекс.Карты */
  routeUrl: 'https://yandex.com/maps/?rtext=~38.538432,68.762671',

  socials: {
    instagram: { label: 'Instagram', href: 'https://instagram.com/olami_tekhnika.tj' } as SocialLink,
    // TODO: Telegram пока нет — скрыт в UI
    telegram: { label: 'Telegram', href: '' } as SocialLink,
    whatsapp: { label: 'WhatsApp', href: 'https://wa.me/992912900900' } as SocialLink,
  },
} as const

/** Соцсети с заполненными ссылками (для рендера) */
export const activeSocials = (): Array<{ key: string } & SocialLink> =>
  Object.entries(CONTACTS.socials)
    .filter(([, value]) => value.href !== '')
    .map(([key, value]) => ({ key, ...value }))
