"""
Самотест API: прогоняет все эндпоинты и печатает таблицу статусов.
Запуск: PYTHONUTF8=1 .venv/Scripts/python.exe scripts/api_selftest.py
"""
import io
import os
import sys

import requests

API = os.environ.get('API_URL', 'http://127.0.0.1:8000/api')
USERNAME = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
PASSWORD = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'alrig-admin-2026')

results = []
failed = []


def check(name, ok, expected, actual, detail=''):
    status = 'OK' if ok else 'FAIL'
    results.append((name, expected, actual, status, detail))
    if not ok:
        failed.append(name)


def png_bytes():
    """Минимальный валидный PNG 1x1."""
    from PIL import Image
    buf = io.BytesIO()
    Image.new('RGB', (4, 4), (200, 30, 30)).save(buf, format='PNG')
    buf.seek(0)
    return buf


def main():
    s = requests.Session()

    # ── публичное чтение ──
    r = s.get(f'{API}/categories/')
    check('GET /categories/', r.status_code == 200 and len(r.json()) == 3, '200, 3 шт', f'{r.status_code}, {len(r.json()) if r.ok else "-"} шт')

    r = s.get(f'{API}/categories/melkaya-tekhnika/')
    subs_in_cat = len(r.json().get('subcategories', [])) if r.ok else 0
    check('GET /categories/{slug}/', r.status_code == 200 and subs_in_cat == 4, '200, 4 подкат.', f'{r.status_code}, {subs_in_cat} подкат.')

    r = s.get(f'{API}/subcategories/')
    check('GET /subcategories/', r.status_code == 200 and len(r.json()) == 9, '200, 9 шт', f'{r.status_code}, {len(r.json()) if r.ok else "-"} шт')

    r = s.get(f'{API}/subcategories/vityazhka/')
    check('GET /subcategories/{slug}/', r.status_code == 200 and r.json()['products_count'] == 5, '200, 5 товаров', f'{r.status_code}, {r.json().get("products_count") if r.ok else "-"} товаров')

    r = s.get(f'{API}/products/')
    body = r.json() if r.ok else {}
    check('GET /products/ (пагинация)', r.status_code == 200 and body.get('count') == 19 and len(body.get('results', [])) == 12,
          '200, count=19, page=12', f'{r.status_code}, count={body.get("count")}, page={len(body.get("results", []))}')

    r = s.get(f'{API}/products/?page_size=5&page=2')
    check('GET /products/?page_size=5&page=2', r.status_code == 200 and len(r.json()['results']) == 5, '200, 5 шт', f'{r.status_code}')

    r = s.get(f'{API}/products/?category=vstraivaemaya-tekhnika')
    check('GET /products/?category=', r.status_code == 200 and r.json()['count'] == 11, '200, count=11', f'{r.status_code}, count={r.json().get("count") if r.ok else "-"}')

    r = s.get(f'{API}/products/?subcategory=vityazhka')
    check('GET /products/?subcategory=', r.status_code == 200 and r.json()['count'] == 5, '200, count=5', f'{r.status_code}, count={r.json().get("count") if r.ok else "-"}')

    r = s.get(f'{API}/products/?featured=true')
    check('GET /products/?featured=true', r.status_code == 200 and r.json()['count'] == 6, '200, count=6', f'{r.status_code}, count={r.json().get("count") if r.ok else "-"}')

    r = s.get(f'{API}/products/?search=утюг')
    check('GET /products/?search=утюг', r.status_code == 200 and r.json()['count'] >= 1, '200, count>=1', f'{r.status_code}, count={r.json().get("count") if r.ok else "-"}')

    r = s.get(f'{API}/products/?ordering=price')
    prices = [float(p['price']) for p in r.json()['results']] if r.ok else []
    check('GET /products/?ordering=price', r.status_code == 200 and prices == sorted(prices), '200, по возрастанию', f'{r.status_code}')

    r = s.get(f'{API}/products/mw-b20mxp07-silver/')
    d = r.json() if r.ok else {}
    check('GET /products/{slug}/', r.status_code == 200 and len(d.get('specs', [])) == 8 and len(d.get('images', [])) == 1 and d.get('category', {}).get('slug') == 'melkaya-tekhnika',
          '200, 8 specs, 1 фото, категория', f'{r.status_code}, {len(d.get("specs", []))} specs, {len(d.get("images", []))} фото')

    # ── auth ──
    r = s.post(f'{API}/auth/login/', json={'username': USERNAME, 'password': PASSWORD})
    check('POST /auth/login/', r.status_code == 200 and 'access' in r.json() and 'refresh' in r.json(), '200 + токены', f'{r.status_code}')
    tokens = r.json()

    r = s.post(f'{API}/auth/login/', json={'username': USERNAME, 'password': 'wrong'})
    check('POST /auth/login/ (плохой пароль)', r.status_code == 401, '401', f'{r.status_code}')

    r = s.post(f'{API}/auth/refresh/', json={'refresh': tokens['refresh']})
    check('POST /auth/refresh/', r.status_code == 200 and 'access' in r.json(), '200 + access', f'{r.status_code}')
    access = r.json()['access']

    r = s.get(f'{API}/auth/me/', headers={'Authorization': f'Bearer {access}'})
    check('GET /auth/me/', r.status_code == 200 and r.json()['username'] == USERNAME, f'200, {USERNAME}', f'{r.status_code}')

    r = s.get(f'{API}/auth/me/')
    check('GET /auth/me/ (без токена)', r.status_code == 401, '401', f'{r.status_code}')

    auth = {'Authorization': f'Bearer {access}'}

    # ── защита записи ──
    r = s.post(f'{API}/categories/', data={'name': 'Хак'})
    check('POST /categories/ (без токена)', r.status_code == 401, '401', f'{r.status_code}')

    r = s.delete(f'{API}/products/wm-6kg/')
    check('DELETE /products/ (без токена)', r.status_code == 401, '401', f'{r.status_code}')

    # ── CRUD цепочка: категория → подкатегория → товар ──
    r = s.post(f'{API}/categories/', data={'name': 'Тестовая категория'}, files={'image': ('t.png', png_bytes(), 'image/png')}, headers=auth)
    check('POST /categories/ (с фото)', r.status_code == 201 and r.json()['slug'] == 'testovaya-kategoriya', '201, авто-slug', f'{r.status_code}, slug={r.json().get("slug") if r.ok else "-"}')
    cat = r.json()

    r = s.patch(f'{API}/categories/{cat["slug"]}/', data={'name': 'Тестовая категория 2'}, headers=auth)
    check('PATCH /categories/{slug}/', r.status_code == 200 and r.json()['name'] == 'Тестовая категория 2', '200', f'{r.status_code}')

    r = s.post(f'{API}/subcategories/', data={'name': 'Тестовая подкатегория', 'category': cat['id']}, headers=auth)
    check('POST /subcategories/', r.status_code == 201, '201', f'{r.status_code}')
    sub = r.json()

    spec_json = '[{"label":"Цвет","value":"Красный"},{"label":"Гарантия","value":"1 год"}]'
    r = s.post(f'{API}/products/', data={
        'name': 'Тестовый товар', 'subcategory': sub['id'], 'price': '999.50',
        'old_price': '1200', 'specs': spec_json, 'subtitle': 'тест',
    }, files={'uploaded_images': ('p.png', png_bytes(), 'image/png')}, headers=auth)
    d = r.json() if r.status_code == 201 else {}
    check('POST /products/ (multipart+specs+фото)', r.status_code == 201 and len(d.get('specs', [])) == 2 and len(d.get('images', [])) == 1 and d.get('images', [{}])[0].get('is_main'),
          '201, 2 specs, 1 главное фото', f'{r.status_code}, {len(d.get("specs", []))} specs, {len(d.get("images", []))} фото')
    prod = d

    r = s.patch(f'{API}/products/{prod["slug"]}/', json={'price': '899', 'specs': [{'label': 'Цвет', 'value': 'Синий'}]}, headers=auth)
    d = r.json() if r.ok else {}
    check('PATCH /products/{slug}/ (цена+specs)', r.status_code == 200 and float(d.get('price', 0)) == 899 and len(d.get('specs', [])) == 1, '200, замена specs', f'{r.status_code}, {len(d.get("specs", []))} specs')

    r = s.post(f'{API}/products/{prod["slug"]}/upload_image/', files={'image': ('p2.png', png_bytes(), 'image/png')}, data={'is_main': 'true'}, headers=auth)
    check('POST /products/{slug}/upload_image/', r.status_code == 201 and r.json()['is_main'], '201, главное', f'{r.status_code}')
    img2 = r.json() if r.ok else {}

    r = s.get(f'{API}/products/{prod["slug"]}/')
    mains = [i for i in r.json()['images'] if i['is_main']] if r.ok else []
    check('Единственное главное фото', r.status_code == 200 and len(mains) == 1 and mains[0]['id'] == img2.get('id'), '1 главное', f'{len(mains)} главных')

    r = s.delete(f'{API}/product-images/{img2["id"]}/', headers=auth)
    check('DELETE /product-images/{id}/', r.status_code == 204, '204', f'{r.status_code}')

    # ── PROTECT ──
    r = s.delete(f'{API}/categories/{cat["slug"]}/', headers=auth)
    check('DELETE категории с подкатегориями', r.status_code == 409, '409 (PROTECT)', f'{r.status_code}')

    r = s.delete(f'{API}/subcategories/{sub["slug"]}/', headers=auth)
    check('DELETE подкатегории с товарами', r.status_code == 409, '409 (PROTECT)', f'{r.status_code}')

    # ── чистка тестовых данных ──
    r = s.delete(f'{API}/products/{prod["slug"]}/', headers=auth)
    check('DELETE /products/{slug}/', r.status_code == 204, '204', f'{r.status_code}')

    r = s.delete(f'{API}/subcategories/{sub["slug"]}/', headers=auth)
    check('DELETE /subcategories/{slug}/ (пустая)', r.status_code == 204, '204', f'{r.status_code}')

    r = s.delete(f'{API}/categories/{cat["slug"]}/', headers=auth)
    check('DELETE /categories/{slug}/ (пустая)', r.status_code == 204, '204', f'{r.status_code}')

    # ── заявки ──
    r = s.post(f'{API}/orders/', json={'name': 'Тест Тестов', 'phone': '+992 900 00 00 00', 'comment': 'тестовая заявка'})
    check('POST /orders/ (публично)', r.status_code == 201, '201', f'{r.status_code}')
    order_id = r.json().get('id')

    prod_id = s.get(f'{API}/products/wm-6kg/').json()['id']
    r = s.post(f'{API}/orders/', json={'name': 'C товаром', 'phone': '+992 1', 'product': prod_id})
    check('POST /orders/ (с товаром)', r.status_code == 201 and r.json()['product_detail']['slug'] == 'wm-6kg', '201 + товар', f'{r.status_code}')
    order2_id = r.json().get('id')

    r = s.get(f'{API}/orders/')
    check('GET /orders/ (без токена)', r.status_code == 401, '401', f'{r.status_code}')

    r = s.get(f'{API}/orders/', headers=auth)
    check('GET /orders/ (админ)', r.status_code == 200 and r.json()['count'] >= 2, '200', f'{r.status_code}')

    r = s.patch(f'{API}/orders/{order_id}/', json={'status': 'done'}, headers=auth)
    check('PATCH /orders/{id}/ (статус)', r.status_code == 200 and r.json()['status'] == 'done', '200, done', f'{r.status_code}')

    for oid in (order_id, order2_id):
        s.delete(f'{API}/orders/{oid}/', headers=auth)

    # ── swagger ──
    r = s.get('http://127.0.0.1:8000/api/docs/')
    check('GET /api/docs/ (swagger)', r.status_code == 200, '200', f'{r.status_code}')

    # ── каталог не пострадал ──
    r = s.get(f'{API}/products/')
    check('Каталог цел после тестов', r.ok and r.json()['count'] == 19, 'count=19', f'count={r.json().get("count") if r.ok else "-"}')

    # ── вывод ──
    w = max(len(r[0]) for r in results) + 2
    print(f'\n{"Проверка".ljust(w)} {"Ожидание".ljust(26)} {"Факт".ljust(26)} Статус')
    print('─' * (w + 62))
    for name, exp, act, status, detail in results:
        print(f'{name.ljust(w)} {exp.ljust(26)} {act.ljust(26)} {status}')
    print(f'\nИтого: {len(results)} проверок, ошибок: {len(failed)}')
    if failed:
        print('ПРОВАЛЕНЫ:', ', '.join(failed))
        sys.exit(1)
    print('ВСЁ ЗЕЛЁНОЕ ✅')


if __name__ == '__main__':
    main()
