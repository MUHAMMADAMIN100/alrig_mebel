"""Приводим оплату в уже сохранённых данных к единому значению.

Оплата теперь только «Наличные / перевод»: нормализуем все спецификации
с меткой «Оплата» (на случай записей, залитых старым сидом).
"""
from django.db import migrations

PAYMENT_VALUE = 'Наличные / перевод'


def forwards(apps, schema_editor):
    ProductSpec = apps.get_model('catalog', 'ProductSpec')
    ProductSpec.objects.filter(label='Оплата').update(value=PAYMENT_VALUE)


def backwards(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('catalog', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
