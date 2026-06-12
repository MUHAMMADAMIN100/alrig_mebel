"""
Seed-скрипт: переносит текущий хардкод-каталог (src/data/products.ts) в API.

Запуск (backend запущен на API_URL):
    .venv/Scripts/python.exe scripts/seed.py

Идемпотентен: upsert по slug, повторный запуск не создаёт дублей.
Картинки берутся из public/assets фронтенда и загружаются только
если у товара/категории ещё нет изображений.
"""
import os
import sys
from pathlib import Path

import requests

API_URL = os.environ.get('API_URL', 'http://127.0.0.1:8000/api')
USERNAME = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
PASSWORD = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'alrig-admin-2026')

# repo_root/backend/scripts/seed.py -> repo_root/public
PUBLIC_DIR = Path(__file__).resolve().parents[2] / 'public'

# ─────────────────────────────── данные ───────────────────────────────

CATEGORIES = [
    {
        'slug': 'krupnaya-tekhnika',
        'name': 'Крупная бытовая техника',
        'image': '/assets/products/washing machine/mini-m2.jpg',
        'order': 1,
    },
    {
        'slug': 'vstraivaemaya-tekhnika',
        'name': 'Встраиваемая техника',
        'image': '/assets/products/dukhovka/mini-r.jpg',
        'order': 2,
    },
    {
        'slug': 'melkaya-tekhnika',
        'name': 'Мелкая бытовая техника',
        'image': '/assets/products/microvawe/1.jpg',
        'order': 3,
    },
]

SUBCATEGORIES = [
    {'slug': 'washing-machine', 'name': 'Стиральные машины', 'category': 'krupnaya-tekhnika',
     'image': '/assets/products/washing machine/mini-m2.jpg', 'order': 1},
    {'slug': 'kholodilnik', 'name': 'Холодильники', 'category': 'krupnaya-tekhnika',
     'image': '/assets/products/kholodilnik/mini-b.jpg', 'order': 2},
    {'slug': 'dukhovka', 'name': 'Духовые шкафы', 'category': 'vstraivaemaya-tekhnika',
     'image': '/assets/products/dukhovka/mini-r.jpg', 'order': 1},
    {'slug': 'vityazhka', 'name': 'Вытяжки', 'category': 'vstraivaemaya-tekhnika',
     'image': '/assets/products/vityazhka/6.jpg', 'order': 2},
    {'slug': 'varochnaya-panel', 'name': 'Варочные панели', 'category': 'vstraivaemaya-tekhnika',
     'image': '/assets/products/vityazhka/10.jpg', 'order': 3},
    {'slug': 'microwave', 'name': 'Микроволновые печи', 'category': 'melkaya-tekhnika',
     'image': '/assets/products/microvawe/1.jpg', 'order': 1},
    {'slug': 'utyug', 'name': 'Утюги', 'category': 'melkaya-tekhnika',
     'image': '/assets/products/utyug/4.jpg', 'order': 2},
    {'slug': 'chaynik', 'name': 'Электрические чайники', 'category': 'melkaya-tekhnika',
     'image': '/assets/products/chaynik/5.jpg', 'order': 3},
    {'slug': 'termos', 'name': 'Термосы', 'category': 'melkaya-tekhnika',
     'image': '/assets/products/termos/3.jpg', 'order': 4},
]

PAY = {'label': 'Оплата', 'value': 'Наличные / перевод'}

PRODUCTS = [
    # ── Стиральные машины ──
    {
        'slug': 'wm-6kg', 'subcategory': 'washing-machine',
        'name': 'Стиральная машина', 'subtitle': '6 кг', 'price': 1800, 'order': 1,
        'images': ['/assets/products/washing machine/mini-m2.jpg',
                   '/assets/products/washing machine/Market 1.png',
                   '/assets/products/washing machine/Market 1 1.png'],
        'specs': [{'label': 'Загрузка', 'value': '6 кг'},
                  {'label': 'Тип загрузки', 'value': 'Фронтальная'}, PAY],
        'description': 'Стиральная машина с загрузкой 6 кг. Надёжная техника для семьи.',
    },
    {
        'slug': 'wm-10kg', 'subcategory': 'washing-machine',
        'name': 'Стиральная машина', 'subtitle': '10 кг / BLDC Inverter', 'price': 2400,
        'order': 2, 'is_featured': True,
        'images': ['/assets/products/washing machine/mini-m1.jpg',
                   '/assets/products/washing machine/Market 1 1.png'],
        'specs': [{'label': 'Загрузка', 'value': '10 кг'},
                  {'label': 'Двигатель', 'value': 'BLDC Inverter'},
                  {'label': 'Тип загрузки', 'value': 'Фронтальная'}, PAY],
        'description': 'Стиральная машина 10 кг с инверторным двигателем BLDC. Тихая и экономичная.',
    },
    # ── Микроволновые печи ──
    {
        'slug': 'mw-b20mxp07-silver', 'subcategory': 'microwave',
        'name': 'Микроволновая печь ALRIG B20MXP07', 'subtitle': 'Серебристый цвет / 20 л',
        'price': 850, 'order': 1, 'is_featured': True,
        'images': ['/assets/products/microvawe/1.jpg'],
        'specs': [{'label': 'Модель', 'value': 'B20MXP07'},
                  {'label': 'Объём', 'value': '20 литров'},
                  {'label': 'Мощность', 'value': '700 Вт'},
                  {'label': 'Напряжение', 'value': '220–240 В / 50 Гц'},
                  {'label': 'Управление', 'value': 'Механическое (поворотные ручки)'},
                  {'label': 'Цвет', 'value': 'Серебристый'},
                  {'label': 'Гарантия', 'value': '5 лет'}, PAY],
        'description': ('Микроволновая печь ALRIG B20MXP07 объёмом 20 литров и мощностью 700 Вт. '
                        'Идеально подходит для разогрева, размораживания и приготовления блюд. '
                        'Удобное механическое управление, стильный серебристый дизайн. '
                        'Гарантия производителя — 5 лет.'),
    },
    {
        'slug': 'mw-b20mxp07-black', 'subcategory': 'microwave',
        'name': 'Микроволновая печь ALRIG B20MXP07', 'subtitle': 'Чёрный цвет / 20 л',
        'price': 850, 'order': 2,
        'images': ['/assets/products/microvawe/2.jpg', '/assets/products/microvawe/h1.jpg'],
        'specs': [{'label': 'Модель', 'value': 'B20MXP07'},
                  {'label': 'Объём', 'value': '20 литров'},
                  {'label': 'Мощность', 'value': '700 Вт'},
                  {'label': 'Напряжение', 'value': '220–240 В / 50 Гц'},
                  {'label': 'Управление', 'value': 'Механическое (поворотные ручки)'},
                  {'label': 'Цвет', 'value': 'Чёрный'},
                  {'label': 'Гарантия', 'value': '5 лет'}, PAY],
        'description': ('Микроволновая печь ALRIG B20MXP07 в стильном чёрном исполнении. '
                        'Объём 20 литров, мощность 700 Вт, удобное механическое управление. Гарантия 5 лет.'),
    },
    # ── Холодильники ──
    {
        'slug': 'fridge-white', 'subcategory': 'kholodilnik',
        'name': 'Холодильник', 'subtitle': 'Белый', 'price': 2500, 'order': 1,
        'images': ['/assets/products/kholodilnik/b1.jpg', '/assets/products/kholodilnik/b2.jpg'],
        'specs': [{'label': 'Цвет', 'value': 'Белый'}, PAY],
        'description': 'Холодильник в белом цвете. Надёжный и вместительный.',
    },
    # ── Духовые шкафы ──
    {
        'slug': 'oven-black', 'subcategory': 'dukhovka',
        'name': 'Духовой шкаф', 'subtitle': 'Чёрный', 'price': 1000, 'order': 1,
        'images': ['/assets/products/dukhovka/c1.jpg', '/assets/products/dukhovka/c2.jpg'],
        'specs': [{'label': 'Цвет', 'value': 'Чёрный'}, PAY],
        'description': 'Духовой шкаф в чёрном цвете. Отлично подходит для выпечки и запекания.',
    },
    {
        'slug': 'oven-brown', 'subcategory': 'dukhovka',
        'name': 'Духовой шкаф', 'subtitle': 'Коричневый', 'price': 1000, 'order': 2,
        'images': ['/assets/products/dukhovka/r1.jpg', '/assets/products/dukhovka/r2.jpg'],
        'specs': [{'label': 'Цвет', 'value': 'Коричневый'}, PAY],
        'description': 'Духовой шкаф в коричневом цвете.',
    },
    # ── Утюги ──
    {
        'slug': 'iron-sfb1991', 'subcategory': 'utyug',
        'name': 'Паровой утюг ALRIG Steam Iron', 'subtitle': 'S.F.B 1991 / 3000 Вт',
        'price': 550, 'order': 1, 'is_featured': True,
        'images': ['/assets/products/utyug/4.jpg'],
        'specs': [{'label': 'Модель', 'value': 'S.F.B 1991'},
                  {'label': 'Мощность', 'value': '3000 Вт'},
                  {'label': 'Резервуар воды', 'value': '350 мл'},
                  {'label': 'Подошва', 'value': 'Керамическая (Ceramic Soleplate)'},
                  {'label': 'Функции', 'value': 'Спрей / пар / паровой удар / вертикальный пар'},
                  {'label': 'Защита от накипи', 'value': 'Anti Calc'},
                  {'label': 'Защита от капель', 'value': 'Drip Stop'},
                  {'label': 'Регулировка температуры', 'value': 'Плавная'},
                  {'label': 'Подходит для', 'value': 'Всех типов тканей'},
                  {'label': 'Гарантия', 'value': '5 лет'}, PAY],
        'description': ('Мощный паровой утюг ALRIG S.F.B 1991 с керамической подошвой. '
                        'Большой резервуар на 350 мл, мощность 3000 Вт. Подходит для всех типов тканей. '
                        'Функции: спрей, пар, паровой удар, вертикальный пар, защита от накипи Anti Calc '
                        'и защита от капель Drip Stop. Гарантия 5 лет.'),
    },
    # ── Чайники ──
    {
        'slug': 'kettle-sfb1991', 'subcategory': 'chaynik',
        'name': 'Электрический чайник ALRIG', 'subtitle': 'S.F.B 1991 / 2 л',
        'price': 450, 'order': 1, 'is_featured': True,
        'images': ['/assets/products/chaynik/5.jpg'],
        'specs': [{'label': 'Модель', 'value': 'S.F.B 1991'},
                  {'label': 'Объём', 'value': '2 литра'},
                  {'label': 'Мощность', 'value': '2000 Вт'},
                  {'label': 'Материал корпуса', 'value': 'Нержавеющая сталь SUS 304'},
                  {'label': 'Быстрый нагрев', 'value': 'Да'},
                  {'label': 'Автоотключение', 'value': 'Да'},
                  {'label': 'Контроль температуры', 'value': 'Точный'},
                  {'label': 'Гарантия', 'value': '3 года'}, PAY],
        'description': ('Электрический чайник ALRIG S.F.B 1991 с быстрым нагревом. Корпус из '
                        'нержавеющей стали SUS 304, объём 2 литра, мощность 2000 Вт. Точный контроль '
                        'температуры и автоматическое отключение. Гарантия 3 года.'),
    },
    # ── Термосы ──
    {
        'slug': 'vacuum-jug-sfb1991', 'subcategory': 'termos',
        'name': 'Термос ALRIG Vacuum Jug', 'subtitle': 'S.F.B 1991 / 2 л / NEW 2026',
        'price': 350, 'order': 1,
        'images': ['/assets/products/termos/3.jpg'],
        'specs': [{'label': 'Модель', 'value': 'S.F.B 1991'},
                  {'label': 'Объём', 'value': '2 литра'},
                  {'label': 'Материал', 'value': 'Нержавеющая сталь Inox'},
                  {'label': 'Корпус', 'value': 'Небьющийся (Unbreakable)'},
                  {'label': 'Ручка', 'value': 'Удобный хват, термостойкая'},
                  {'label': 'Качество', 'value': 'Quality Assurance Guarantee'},
                  {'label': 'Гарантия', 'value': '3 года'}, PAY],
        'description': ('Термос ALRIG Vacuum Jug S.F.B 1991 объёмом 2 литра. Корпус из нержавеющей '
                        'стали Inox — небьющийся и долговечный. Удобная термостойкая ручка с удобным '
                        'хватом. Долго сохраняет температуру напитков. Новая модель 2026 года. '
                        'Гарантия качества 3 года.'),
    },
    # ── Вытяжки ──
    {
        'slug': 'hood-alrig-display', 'subcategory': 'vityazhka',
        'name': 'Кухонная вытяжка ALRIG', 'subtitle': 'Сенсорный дисплей / LED',
        'price': 1500, 'order': 1, 'is_featured': True,
        'images': ['/assets/products/vityazhka/6.jpg'],
        'specs': [{'label': 'Тип', 'value': 'Подвесная'},
                  {'label': 'Управление', 'value': 'Сенсорный дисплей'},
                  {'label': 'Подсветка', 'value': 'LED, 2 лампы'},
                  {'label': 'Фильтр', 'value': 'Алюминиевый, моющийся'},
                  {'label': 'Материал корпуса', 'value': 'Сталь с покрытием'},
                  {'label': 'Цвет', 'value': 'Чёрный'}, PAY],
        'description': ('Кухонная вытяжка ALRIG с современным сенсорным дисплеем и яркой LED-подсветкой '
                        '(2 лампы). Чёрный корпус, алюминиевые моющиеся фильтры. Эффективно очищает '
                        'воздух на кухне.'),
    },
    {
        'slug': 'hood-alrig-1200', 'subcategory': 'vityazhka',
        'name': 'Кухонная вытяжка ALRIG', 'subtitle': 'Классическая чёрная',
        'price': 1200, 'order': 2,
        'images': ['/assets/products/varochnaya/11.jpg'],
        'specs': [{'label': 'Тип', 'value': 'Подвесная'},
                  {'label': 'Управление', 'value': 'Кнопочное'},
                  {'label': 'Подсветка', 'value': 'LED, 2 лампы'},
                  {'label': 'Фильтр', 'value': 'Алюминиевый, моющийся'},
                  {'label': 'Цвет', 'value': 'Чёрный'}, PAY],
        'description': ('Кухонная вытяжка ALRIG в классическом чёрном исполнении. Простое кнопочное '
                        'управление, LED-подсветка, моющиеся алюминиевые фильтры. Базовая модель '
                        'с надёжной работой.'),
    },
    {
        'slug': 'hood-alrig-glass', 'subcategory': 'vityazhka',
        'name': 'Наклонная вытяжка ALRIG', 'subtitle': 'Со стеклянным экраном',
        'price': 1800, 'order': 3,
        'images': ['/assets/products/varochnaya/15.jpg'],
        'specs': [{'label': 'Тип', 'value': 'Наклонная со стеклом'},
                  {'label': 'Управление', 'value': 'Сенсорное'},
                  {'label': 'Подсветка', 'value': 'LED'},
                  {'label': 'Фильтр', 'value': 'Алюминиевый, моющийся'},
                  {'label': 'Цвет', 'value': 'Чёрный со стеклом'}, PAY],
        'description': ('Стильная наклонная вытяжка ALRIG со стеклянным экраном. Современный дизайн '
                        'идеально подходит для просторных кухонь. Сенсорное управление и LED-подсветка.'),
    },
    {
        'slug': 'hood-alrig-built-in', 'subcategory': 'vityazhka',
        'name': 'Встраиваемая вытяжка ALRIG', 'subtitle': 'Телескопическая',
        'price': 3000, 'order': 4,
        'images': ['/assets/products/vityazhka/7.jpg'],
        'specs': [{'label': 'Тип', 'value': 'Встраиваемая (телескопическая)'},
                  {'label': 'Управление', 'value': 'Сенсорное'},
                  {'label': 'Цвет', 'value': 'Чёрный'},
                  {'label': 'Установка', 'value': 'В кухонный шкаф'},
                  {'label': 'Подсветка', 'value': 'LED'}, PAY],
        'description': ('Встраиваемая телескопическая вытяжка ALRIG для скрытой установки в кухонный '
                        'шкаф. Современное сенсорное управление, чёрный корпус. Отличное решение для '
                        'аккуратного дизайна кухни.'),
    },
    {
        'slug': 'hood-gorenj', 'subcategory': 'vityazhka',
        'name': 'Кухонная вытяжка Gorenj', 'subtitle': 'С прозрачным фильтром',
        'price': 1600, 'order': 5,
        'images': ['/assets/products/varochnaya/12.jpg'],
        'specs': [{'label': 'Бренд', 'value': 'Gorenj'},
                  {'label': 'Тип', 'value': 'Подвесная'},
                  {'label': 'Управление', 'value': 'Сенсорное'},
                  {'label': 'Фильтр', 'value': 'Прозрачный, моющийся'},
                  {'label': 'Цвет', 'value': 'Чёрный'}, PAY],
        'description': 'Вытяжка Gorenj с прозрачным моющимся фильтром и сенсорным управлением. Современный дизайн.',
    },
    # ── Варочные панели ──
    {
        'slug': 'cooktop-gas-glass-3800', 'subcategory': 'varochnaya-panel',
        'name': 'Газовая варочная панель ALRIG', 'subtitle': '4 газовые конфорки / стекло',
        'price': 3800, 'order': 1,
        'images': ['/assets/products/vityazhka/10.jpg'],
        'specs': [{'label': 'Тип', 'value': 'Газовая'},
                  {'label': 'Конфорки', 'value': '4 газовые'},
                  {'label': 'Поверхность', 'value': 'Закалённое стекло'},
                  {'label': 'Управление', 'value': 'Поворотные ручки'},
                  {'label': 'Цвет', 'value': 'Чёрный'},
                  {'label': 'Установка', 'value': 'Встраиваемая'}, PAY],
        'description': ('Газовая варочная панель ALRIG с 4 газовыми конфорками на стеклянной '
                        'поверхности. Стильный чёрный дизайн, удобные поворотные ручки управления. '
                        'Встраиваемая модель.'),
    },
    {
        'slug': 'cooktop-combo-glass', 'subcategory': 'varochnaya-panel',
        'name': 'Комбинированная варочная панель ALRIG', 'subtitle': '2 газа + 2 электро / стекло',
        'price': 3500, 'order': 2,
        'images': ['/assets/products/varochnaya/13.jpg'],
        'specs': [{'label': 'Тип', 'value': 'Комбинированная (газ + электро)'},
                  {'label': 'Конфорки', 'value': '2 газовые + 2 электрические'},
                  {'label': 'Поверхность', 'value': 'Закалённое стекло'},
                  {'label': 'Управление', 'value': 'Поворотные ручки'},
                  {'label': 'Цвет', 'value': 'Чёрный'},
                  {'label': 'Установка', 'value': 'Встраиваемая'}, PAY],
        'description': ('Комбинированная варочная панель ALRIG со стеклянной поверхностью: 2 газовые '
                        'и 2 электрические конфорки. Универсальное решение для любой кухни.'),
    },
    {
        'slug': 'cooktop-combo-steel', 'subcategory': 'varochnaya-panel',
        'name': 'Комбинированная варочная панель ALRIG', 'subtitle': '2 газа + 2 электро / нержавейка',
        'price': 3200, 'order': 3,
        'images': ['/assets/products/varochnaya/9.jpg'],
        'specs': [{'label': 'Тип', 'value': 'Комбинированная (газ + электро)'},
                  {'label': 'Конфорки', 'value': '2 газовые + 2 электрические'},
                  {'label': 'Поверхность', 'value': 'Нержавеющая сталь'},
                  {'label': 'Управление', 'value': 'Поворотные ручки'},
                  {'label': 'Установка', 'value': 'Встраиваемая'}, PAY],
        'description': ('Прочная комбинированная варочная панель ALRIG из нержавеющей стали. '
                        '2 газовые и 2 электрические конфорки. Долговечная и надёжная.'),
    },
    {
        'slug': 'cooktop-ceramic', 'subcategory': 'varochnaya-panel',
        'name': 'Стеклокерамическая варочная панель ALRIG', 'subtitle': '4 зоны нагрева / сенсор',
        'price': 2800, 'order': 4, 'is_featured': True,
        'images': ['/assets/products/vityazhka/14.jpg', '/assets/products/vityazhka/8.jpg'],
        'specs': [{'label': 'Тип', 'value': 'Электрическая стеклокерамика'},
                  {'label': 'Зоны нагрева', 'value': '4'},
                  {'label': 'Поверхность', 'value': 'Стеклокерамика'},
                  {'label': 'Управление', 'value': 'Сенсорное'},
                  {'label': 'Цвет', 'value': 'Чёрный'},
                  {'label': 'Установка', 'value': 'Встраиваемая'}, PAY],
        'description': ('Современная стеклокерамическая варочная панель ALRIG с 4 зонами нагрева '
                        'и сенсорным управлением. Лёгкая в чистке, стильный внешний вид.'),
    },
]


# ─────────────────────────────── helpers ───────────────────────────────

class Api:
    def __init__(self):
        self.session = requests.Session()

    def login(self):
        r = self.session.post(f'{API_URL}/auth/login/', json={
            'username': USERNAME, 'password': PASSWORD,
        })
        r.raise_for_status()
        self.session.headers['Authorization'] = f'Bearer {r.json()["access"]}'
        print(f'[auth] вход выполнен: {USERNAME}')

    def get(self, path):
        return self.session.get(f'{API_URL}{path}')

    def upsert(self, list_path, slug, data, files=None):
        """POST если slug не существует, иначе PATCH. Возвращает JSON объекта."""
        existing = self.get(f'{list_path}{slug}/')
        if existing.status_code == 200:
            r = self.session.patch(f'{API_URL}{list_path}{slug}/', data=data, files=files or {})
            action = 'обновлено'
        else:
            r = self.session.post(f'{API_URL}{list_path}', data=data, files=files or {})
            action = 'создано'
        if not r.ok:
            print(f'[ОШИБКА] {list_path}{slug}: {r.status_code} {r.text[:300]}')
            r.raise_for_status()
        print(f'  {action}: {list_path}{slug}')
        return r.json()


def open_image(public_path: str):
    """Открывает файл из public/ фронтенда. None если не найден."""
    path = PUBLIC_DIR / public_path.lstrip('/')
    if not path.exists():
        print(f'  [warn] нет файла: {path}')
        return None
    return open(path, 'rb')


def main():
    api = Api()
    api.login()

    print('\n── Категории ──')
    for cat in CATEGORIES:
        data = {'name': cat['name'], 'slug': cat['slug'], 'order': cat['order'], 'is_active': 'true'}
        existing = api.get(f'/categories/{cat["slug"]}/')
        has_image = existing.status_code == 200 and existing.json().get('image')
        files = {}
        if not has_image:
            f = open_image(cat['image'])
            if f:
                files['image'] = f
        api.upsert('/categories/', cat['slug'], data, files)
        for f in files.values():
            f.close()

    print('\n── Подкатегории ──')
    cat_ids = {c['slug']: c['id'] for c in api.get('/categories/').json()}
    for sub in SUBCATEGORIES:
        data = {
            'name': sub['name'], 'slug': sub['slug'],
            'category': cat_ids[sub['category']],
            'order': sub['order'], 'is_active': 'true',
        }
        existing = api.get(f'/subcategories/{sub["slug"]}/')
        has_image = existing.status_code == 200 and existing.json().get('image')
        files = {}
        if not has_image:
            f = open_image(sub['image'])
            if f:
                files['image'] = f
        api.upsert('/subcategories/', sub['slug'], data, files)
        for f in files.values():
            f.close()

    print('\n── Товары ──')
    sub_ids = {s['slug']: s['id'] for s in api.get('/subcategories/').json()}
    for p in PRODUCTS:
        payload = {
            'name': p['name'], 'slug': p['slug'], 'subtitle': p.get('subtitle', ''),
            'description': p.get('description', ''),
            'subcategory': sub_ids[p['subcategory']],
            'price': p['price'], 'currency': 'сомони',
            'in_stock': True, 'is_active': True,
            'is_featured': p.get('is_featured', False),
            'order': p.get('order', 0),
            'specs': p['specs'],
        }
        existing = api.get(f'/products/{p["slug"]}/')
        if existing.status_code == 200:
            r = api.session.patch(f'{API_URL}/products/{p["slug"]}/', json=payload)
            action = 'обновлено'
        else:
            r = api.session.post(f'{API_URL}/products/', json=payload)
            action = 'создано'
        if not r.ok:
            print(f'[ОШИБКА] товар {p["slug"]}: {r.status_code} {r.text[:300]}')
            r.raise_for_status()
        product = r.json()
        print(f'  {action}: товар {p["slug"]}')

        # картинки — только если их ещё нет (идемпотентность)
        if not product.get('images'):
            for i, img_path in enumerate(p['images']):
                f = open_image(img_path)
                if not f:
                    continue
                up = api.session.post(
                    f'{API_URL}/products/{p["slug"]}/upload_image/',
                    files={'image': f},
                    data={'alt': p['name'], 'is_main': 'true' if i == 0 else 'false'},
                )
                f.close()
                if not up.ok:
                    print(f'  [ОШИБКА] фото {img_path}: {up.status_code} {up.text[:200]}')
                else:
                    print(f'    фото загружено: {img_path}')

    print('\n── Итог ──')
    cats = api.get('/categories/').json()
    subs = api.get('/subcategories/').json()
    prods = api.get('/products/?page_size=100').json()
    print(f'Категорий: {len(cats)}, подкатегорий: {len(subs)}, товаров: {prods["count"]}')


if __name__ == '__main__':
    try:
        main()
    except requests.RequestException as exc:
        print(f'СБОЙ: {exc}')
        sys.exit(1)
