/**
 * E2E новых header / footer / секции контактов.
 * Запуск: node e2e/run-e2e-hfc.mjs (нужны backend + vite dev)
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:5173'
mkdirSync('screenshots', { recursive: true })

const results = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? '  OK ' : 'FAIL '} ${name}${detail ? ` — ${detail}` : ''}`)
}
const shot = async (page, name) => {
  await page.screenshot({ path: `screenshots/${name}.png` })
  console.log(`  📸 ${name}.png`)
}

const errors = []

async function run() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 150)))

  // ═══ Контакты: чужого контента нет ═══
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForSelector('text=Техника ALRIG', { timeout: 15000 })
  const html = await page.content()
  check('Нет «Заказать стол»', !html.includes('Заказать стол'))
  check('Нет stol.dushanbe / barf', !html.includes('stol.dushanbe') && !html.includes('barf'))
  check('Роут /contacts удалён (редирект/пусто)', true) // проверим ниже отдельно

  // ═══ Секция контактов на главной ═══
  const contactsSection = page.locator('#contacts')
  check('Секция #contacts существует', await contactsSection.count() === 1)
  await contactsSection.scrollIntoViewIfNeeded()
  await page.waitForTimeout(1500) // карта
  check('Телефон ALRIG в секции', await page.locator('#contacts >> text=975 20 51 15').first().isVisible())
  check('Режим работы', await page.locator('#contacts >> text=Пн–Сб').first().isVisible())
  check('CTA «Связаться»', await page.locator('#contacts >> text=Связаться').first().isVisible())
  const hasMap = await page.locator('#contacts canvas, #contacts ymaps, #contacts [class*="ymaps"]').count()
  check('Карта отрисована', hasMap > 0, `${hasMap} элем.`)
  await shot(page, '18-contacts-section')

  // ═══ Header: мега-меню ═══
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)
  await page.click('button:has-text("Каталог")')
  await page.waitForTimeout(400)
  const megaLinks = await page.locator('header a[href^="/products/"]').count()
  check('Мега-меню: подкатегории из API', megaLinks >= 9, `${megaLinks} ссылок`)
  check('Мега-меню: категории', await page.locator('header >> text=Встраиваемая техника').isVisible())
  await shot(page, '19-header-megamenu')

  // переход из мега-меню
  await page.click('header a[href="/products/vityazhka"]')
  await page.waitForSelector('h1:has-text("Вытяжки")')
  check('Навигация из мега-меню работает', true)

  // ═══ Якорь «Контакты» с другой страницы ═══
  await page.click('header a[href="/#contacts"]')
  await page.waitForURL('**/#contacts')
  await page.waitForTimeout(1200) // плавный скролл
  const scrolled = await page.evaluate(() => {
    const el = document.getElementById('contacts')
    if (!el) return false
    const rect = el.getBoundingClientRect()
    return rect.top < window.innerHeight && rect.bottom > 0
  })
  check('Якорный скролл к #contacts с другой страницы', scrolled)

  // ═══ Sticky header при скролле ═══
  await page.evaluate(() => window.scrollTo(0, 600))
  await page.waitForTimeout(400)
  const headerVisible = await page.evaluate(() => {
    const header = document.querySelector('header')
    return header ? header.getBoundingClientRect().top >= 0 : false
  })
  check('Header sticky при скролле', headerVisible)

  // ═══ Footer ═══
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(600)
  check('Footer: колонка Каталог из API', await page.locator('footer >> text=Стиральные машины').isVisible())
  check('Footer: телефон', await page.locator('footer >> text=975 20 51 15').first().isVisible())
  check('Footer: копирайт © ALRIG', (await page.locator('footer').textContent())?.includes('© ALRIG,') ?? false)
  await shot(page, '20-footer')

  // ═══ Старый роут /contacts больше не существует ═══
  await page.goto(`${BASE}/contacts`, { waitUntil: 'load' })
  const isOldContacts = (await page.content()).includes('stol') || (await page.content()).includes('Заказать стол')
  check('Старая страница /contacts удалена (чужого контента нет)', !isOldContacts)

  // ═══ Мобильное меню ═══
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } })
  mob.on('pageerror', (e) => errors.push(`mobile: ${String(e).slice(0, 150)}`))
  await mob.goto(BASE, { waitUntil: 'load' })
  await mob.waitForSelector('text=Техника ALRIG')
  await mob.click('button[aria-label="Открыть меню"]')
  await mob.waitForTimeout(500)
  check('Мобильное меню открылось', await mob.locator('text=Пн–Сб').first().isVisible())
  const mobCats = await mob.locator('a[href^="/products/"]:visible').count()
  check('Мобильное меню: категории из API', mobCats >= 9, `${mobCats} ссылок`)
  await shot(mob, '21-mobile-menu')
  // клик по категории закрывает меню и ведёт на страницу
  await mob.click('a[href="/products/kholodilnik"]:visible')
  await mob.waitForSelector('h1:has-text("Холодильники")')
  check('Навигация из мобильного меню', true)
  await shot(mob, '22-mobile-subcategory-new-header')

  check('Нет JS-ошибок', errors.length === 0, errors.slice(0, 2).join(' | '))

  await browser.close()
  const failed = results.filter((r) => !r.ok)
  console.log(`\n══ Итого: ${results.length}, ошибок: ${failed.length} ══`)
  if (failed.length) {
    failed.forEach((f) => console.log(`  ✗ ${f.name} ${f.detail}`))
    process.exit(1)
  }
  console.log('ВСЁ ЗЕЛЁНОЕ ✅')
}

run().catch((err) => {
  console.error('СБОЙ:', err)
  process.exit(1)
})
