/**
 * Сквозная самопроверка UI (Playwright + Chromium).
 * Запуск: node e2e/run-e2e.mjs
 * Требует: запущенный backend (127.0.0.1:8000) и vite dev (localhost:5173).
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:5173'
const SHOTS = 'screenshots'
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'alrig-admin-2026'

mkdirSync(SHOTS, { recursive: true })

const results = []
let consoleErrors = []

function check(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? '  OK ' : 'FAIL '} ${name}${detail ? ` — ${detail}` : ''}`)
}

async function shot(page, name) {
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false })
  console.log(`  📸 ${name}.png`)
}

const IGNORED_CONSOLE = [
  /favicon/i,
  /site\.webmanifest/i,
  /React DevTools/i,
  /Download the React DevTools/i,
  // ожидаемый 401: тест refresh-интерсептора нарочно ломает access-токен,
  // браузер логирует сетевой 401 до того, как интерсептор обновит токен
  /Failed to load resource.*401/i,
  // deprecation-предупреждение React из библиотеки @pbe/react-yandex-maps
  /defaultProps will be removed/i,
]

async function run() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  page.on('console', (msg) => {
    if (msg.type() === 'error' && !IGNORED_CONSOLE.some((re) => re.test(msg.text()))) {
      consoleErrors.push(msg.text().slice(0, 200))
    }
  })
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${String(err).slice(0, 200)}`))

  // отслеживаем запросы к API — данные должны идти из API, не из хардкода
  let apiRequests = 0
  page.on('request', (req) => {
    if (req.url().includes('127.0.0.1:8000/api')) apiRequests++
  })

  // ═══ 1. Главная ═══
  await page.goto(BASE, { waitUntil: 'networkidle' })
  check('Главная открылась', (await page.title()).includes('ALRIG'))
  await page.waitForSelector('text=Техника ALRIG', { timeout: 10000 })
  check('Hero отрисован', true)
  const featuredCards = await page.locator('a[href^="/product/"]').count()
  check('Featured-товары с API на главной', featuredCards > 0, `${featuredCards} карточек`)
  await shot(page, '01-main-desktop')

  // ═══ 2. Каталог ═══
  await page.goto(`${BASE}/products`, { waitUntil: 'networkidle' })
  await page.waitForSelector('text=Каталог товаров')
  const subcatCards = await page.locator('a[href^="/products/"]').count()
  check('Каталог: подкатегории из API', subcatCards >= 9, `${subcatCards} ссылок`)
  await shot(page, '02-catalog-desktop')

  // ═══ 3. Подкатегория ═══
  await page.goto(`${BASE}/products/vityazhka`, { waitUntil: 'networkidle' })
  await page.waitForSelector('h1:has-text("Вытяжки")')
  const productCards = await page.locator('a[href^="/product/"]').count()
  check('Подкатегория «Вытяжки»: товары из API', productCards === 5, `${productCards} товаров`)
  check('Счётчик «Найдено: 5»', await page.locator('text=Найдено:').isVisible())
  await shot(page, '03-subcategory-desktop')

  // сортировка
  await page.selectOption('select[aria-label="Сортировка"]', 'price')
  await page.waitForTimeout(800)
  const firstPrice = (await page.locator('a[href^="/product/"]').first().textContent())?.replace(/ /g, ' ')
  check('Сортировка по цене работает', /1\s?200/.test(firstPrice ?? ''), firstPrice?.slice(0, 80))

  // ═══ 4. Категория ═══
  await page.goto(`${BASE}/category/vstraivaemaya-tekhnika`, { waitUntil: 'networkidle' })
  await page.waitForSelector('h1:has-text("Встраиваемая техника")')
  check('Страница категории: счётчик', await page.locator('text=Найдено:').isVisible())
  await shot(page, '04-category-desktop')

  // ═══ 5. Страница товара ═══
  await page.goto(`${BASE}/product/mw-b20mxp07-silver`, { waitUntil: 'networkidle' })
  await page.waitForSelector('h1:has-text("Микроволновая печь ALRIG B20MXP07")')
  check('Товар: заголовок', true)
  check('Товар: цена', await page.locator('text=850').first().isVisible())
  check('Товар: характеристики', await page.locator('text=Характеристики').isVisible())
  const specRows = await page.locator('text=Мощность').count()
  check('Товар: спеки из API', specRows > 0)
  await shot(page, '05-product-desktop')

  // ═══ 6. Заявка через модалку ═══
  await page.click('[data-testid="order-button"]')
  await page.waitForSelector('text=Оформить заявку')
  await shot(page, '06-order-modal')
  await page.fill('input[name="name"]', 'Е2Е Тест')
  await page.fill('input[name="phone"]', '+992 900 11 22 33')
  const [orderResponse] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/orders/') && r.request().method() === 'POST'),
    page.click('button:has-text("Отправить заявку")'),
  ])
  check('POST /orders/ из модалки', orderResponse.status() === 201, `status=${orderResponse.status()}`)
  await page.waitForSelector('text=Заявка отправлена', { timeout: 5000 })
  check('Toast об успехе', true)

  // ═══ 7. Логин ═══
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await shot(page, '07-login')
  await page.fill('#login-username', ADMIN_USER)
  await page.fill('#login-password', ADMIN_PASS)
  await page.click('button:has-text("Войти")')
  await page.waitForURL('**/admin', { timeout: 10000 })
  await page.waitForSelector('text=Дашборд')
  check('Вход → редирект в /admin', true)
  await page.waitForSelector('text=Товаров в каталоге')
  await shot(page, '08-admin-dashboard')

  // ═══ 8. Сессия переживает reload ═══
  await page.reload({ waitUntil: 'networkidle' })
  const stillAdmin = page.url().includes('/admin') && !(page.url().includes('/login'))
  check('Сессия переживает reload', stillAdmin, page.url())

  // ═══ 9. Refresh-токен: ломаем access, запросы должны выжить ═══
  await page.evaluate(() => localStorage.setItem('alrig_access', 'broken-token'))
  await page.goto(`${BASE}/admin/orders`, { waitUntil: 'networkidle' })
  const survivedRefresh = !page.url().includes('/login')
    && await page.locator('h1:has-text("Заявки")').isVisible()
  check('Refresh-интерсептор: битый access → авто-обновление', survivedRefresh)
  const orderRow = await page.locator('text=Е2Е Тест').first().isVisible().catch(() => false)
  check('Заявка из модалки видна в админке', orderRow)
  await shot(page, '09-admin-orders')

  // ═══ 10. Админ: товары (таблица + фильтры) ═══
  await page.goto(`${BASE}/admin/products`, { waitUntil: 'networkidle' })
  await page.waitForSelector('text=Всего: 19')
  check('Админ-товары: count=19', true)
  await shot(page, '10-admin-products')

  // каскадный фильтр
  await page.selectOption('select[aria-label="Фильтр по категории"]', { label: 'Встраиваемая техника' })
  await page.waitForTimeout(700)
  const subOptions = await page.locator('select[aria-label="Фильтр по подкатегории"] option').count()
  check('Каскад фильтров: подкатегории отфильтрованы', subOptions === 4, `${subOptions - 1} опций`)
  await page.waitForSelector('text=Всего: 11')
  check('Фильтр по категории: count=11', true)

  // поиск
  await page.selectOption('select[aria-label="Фильтр по категории"]', '')
  await page.fill('input[type="search"]', 'утюг')
  await page.waitForSelector('text=Всего: 1', { timeout: 5000 })
  check('Поиск «утюг»: count=1', true)
  await page.fill('input[type="search"]', '')

  // ═══ 11. Админ: форма товара (каскад селектов) ═══
  await page.goto(`${BASE}/admin/products/new`, { waitUntil: 'networkidle' })
  await page.waitForSelector('text=Новый товар')
  const subSelect = page.locator('select').nth(1)
  check('Подкатегория заблокирована без категории', await subSelect.isDisabled())
  await page.locator('select').first().selectOption({ label: 'Мелкая бытовая техника' })
  check('Каскад: подкатегория разблокирована', !(await subSelect.isDisabled()))
  const newSubOptions = await subSelect.locator('option').count()
  check('Каскад: только подкатегории выбранной категории', newSubOptions === 5, `${newSubOptions - 1} опций`)
  await shot(page, '11-admin-product-form')

  // ═══ 12. Админ: CRUD категории через UI ═══
  await page.goto(`${BASE}/admin/categories`, { waitUntil: 'networkidle' })
  await page.click('button:has-text("Добавить категорию")')
  await page.waitForSelector('text=Новая категория')
  await page.fill('input[placeholder="Например: Крупная техника"]', 'Е2Е Категория')
  await page.click('button:has-text("Сохранить")')
  await page.waitForSelector('td:has-text("Е2Е Категория")', { timeout: 7000 })
  check('UI-создание категории', true)
  await shot(page, '12-admin-categories')

  // удаление
  const row = page.locator('tr', { hasText: 'Е2Е Категория' })
  await row.locator('button[aria-label="Удалить"]').click()
  await page.waitForSelector('text=Удалить категорию?')
  await page.click('button:has-text("Удалить"):not([aria-label])')
  await page.waitForSelector('td:has-text("Е2Е Категория")', { state: 'detached', timeout: 7000 })
  check('UI-удаление категории', true)

  // ═══ 13. Редактирование товара ═══
  await page.goto(`${BASE}/admin/products/wm-6kg/edit`, { waitUntil: 'networkidle' })
  await page.waitForSelector('text=Редактирование')
  const specInputs = await page.locator('input[placeholder="Характеристика"]').count()
  check('Форма редактирования: спеки загружены', specInputs === 3, `${specInputs} строк`)
  const galleryImages = await page.locator('img[src*="/media/"]').count()
  check('Форма редактирования: галерея', galleryImages >= 3, `${galleryImages} фото`)
  await shot(page, '13-admin-product-edit')

  // ═══ 14. Мобильная версия ═══
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const mp = await mob.newPage()
  mp.on('pageerror', (err) => consoleErrors.push(`mobile pageerror: ${String(err).slice(0, 200)}`))
  await mp.goto(BASE, { waitUntil: 'networkidle' })
  await mp.waitForSelector('text=Техника ALRIG')
  await shot(mp, '14-main-mobile')
  await mp.goto(`${BASE}/products/vityazhka`, { waitUntil: 'networkidle' })
  await mp.waitForSelector('h1:has-text("Вытяжки")')
  await shot(mp, '15-subcategory-mobile')
  await mp.goto(`${BASE}/product/mw-b20mxp07-silver`, { waitUntil: 'networkidle' })
  await mp.waitForSelector('h1')
  await shot(mp, '16-product-mobile')
  check('Мобильные страницы открываются', true)
  await mob.close()

  // ═══ Итоги ═══
  check('Данные тянутся из API (видны запросы к :8000)', apiRequests > 10, `${apiRequests} запросов`)
  check('Нет ошибок в консоли', consoleErrors.length === 0,
    consoleErrors.length ? consoleErrors.slice(0, 3).join(' | ') : '')

  await browser.close()

  const failed = results.filter((r) => !r.ok)
  console.log(`\n══ Итого: ${results.length} проверок, ошибок: ${failed.length} ══`)
  if (failed.length) {
    failed.forEach((f) => console.log(`  ✗ ${f.name} ${f.detail}`))
    process.exit(1)
  }
  console.log('ВСЁ ЗЕЛЁНОЕ ✅')
}

run().catch((err) => {
  console.error('СБОЙ E2E:', err)
  process.exit(1)
})
