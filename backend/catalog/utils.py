"""Утилиты: транслитерация кириллицы и генерация уникальных slug."""
from django.utils.text import slugify

# ГОСТ-подобная транслитерация для slug
CYRILLIC_MAP = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    # таджикские буквы
    'ғ': 'g', 'ӣ': 'i', 'қ': 'q', 'ӯ': 'u', 'ҳ': 'h', 'ҷ': 'j',
}


def transliterate(text: str) -> str:
    result = []
    for char in text:
        lower = char.lower()
        result.append(CYRILLIC_MAP.get(lower, char))
    return ''.join(result)


def unique_slugify(instance, value: str, slug_field: str = 'slug') -> str:
    """Транслит + slugify + уникальность в пределах модели (suffix -2, -3...)."""
    base = slugify(transliterate(value)) or 'item'
    slug = base
    model = instance.__class__
    counter = 2
    qs = model.objects.all()
    if instance.pk:
        qs = qs.exclude(pk=instance.pk)
    while qs.filter(**{slug_field: slug}).exists():
        slug = f'{base}-{counter}'
        counter += 1
    return slug
