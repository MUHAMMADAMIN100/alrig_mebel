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
    label: '+992 975 20 51 15',
    href: 'tel:+992975205115',
  },

  workingHours: 'Пн–Сб: 9:00 – 18:00',

  // TODO: вписать точный адрес магазина ALRIG
  address: 'г. Душанбе',

  /** Центр карты и метка (Душанбе) */
  mapCenter: [38.586216, 68.787027] as [number, number],
  mapZoom: 16,

  socials: {
    // TODO: вписать реальный Instagram ALRIG (пока скрыт в UI)
    instagram: { label: 'Instagram', href: '' } as SocialLink,
    // TODO: вписать реальный Telegram ALRIG (пока скрыт в UI)
    telegram: { label: 'Telegram', href: '' } as SocialLink,
    // TODO: подтвердить, что WhatsApp привязан к основному номеру
    whatsapp: { label: 'WhatsApp', href: 'https://wa.me/992975205115' } as SocialLink,
  },
} as const

/** Соцсети с заполненными ссылками (для рендера) */
export const activeSocials = (): Array<{ key: string } & SocialLink> =>
  Object.entries(CONTACTS.socials)
    .filter(([, value]) => value.href !== '')
    .map(([key, value]) => ({ key, ...value }))
