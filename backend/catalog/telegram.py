"""Уведомления о заявках в Telegram. Опционально — включается через env."""
import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def notify_order(order):
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID
    if not token or not chat_id:
        logger.info('Telegram не настроен (TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID) — пропускаю уведомление.')
        return

    product = f'\nТовар: {order.product.name} ({order.product.subtitle})' if order.product else ''
    comment = f'\nКомментарий: {order.comment}' if order.comment else ''
    text = (
        f'🛒 Новая заявка #{order.pk}\n'
        f'Имя: {order.name}\n'
        f'Телефон: {order.phone}'
        f'{product}{comment}'
    )
    try:
        requests.post(
            f'https://api.telegram.org/bot{token}/sendMessage',
            json={'chat_id': chat_id, 'text': text},
            timeout=5,
        )
    except requests.RequestException:
        logger.exception('Не удалось отправить уведомление в Telegram')
