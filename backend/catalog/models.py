from django.db import models

from .utils import unique_slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampedModel):
    name = models.CharField('Название', max_length=255)
    slug = models.SlugField('Slug', max_length=255, unique=True, blank=True)
    image = models.ImageField('Изображение', upload_to='categories/', blank=True, null=True)
    order = models.PositiveIntegerField('Порядок', default=0)
    is_active = models.BooleanField('Активна', default=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Subcategory(TimeStampedModel):
    category = models.ForeignKey(
        Category,
        verbose_name='Категория',
        related_name='subcategories',
        on_delete=models.PROTECT,
    )
    name = models.CharField('Название', max_length=255)
    slug = models.SlugField('Slug', max_length=255, unique=True, blank=True)
    image = models.ImageField('Изображение', upload_to='subcategories/', blank=True, null=True)
    order = models.PositiveIntegerField('Порядок', default=0)
    is_active = models.BooleanField('Активна', default=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Подкатегория'
        verbose_name_plural = 'Подкатегории'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.category.name} / {self.name}'


class Product(TimeStampedModel):
    subcategory = models.ForeignKey(
        Subcategory,
        verbose_name='Подкатегория',
        related_name='products',
        on_delete=models.PROTECT,
    )
    name = models.CharField('Название', max_length=255)
    slug = models.SlugField('Slug', max_length=255, unique=True, blank=True)
    subtitle = models.CharField('Подзаголовок', max_length=255, blank=True)
    description = models.TextField('Описание', blank=True)
    price = models.DecimalField('Цена', max_digits=12, decimal_places=2)
    old_price = models.DecimalField('Старая цена', max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField('Валюта', max_length=32, default='сомони')
    in_stock = models.BooleanField('В наличии', default=True)
    is_active = models.BooleanField('Активен', default=True)
    is_featured = models.BooleanField('Рекомендуемый', default=False)
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    @property
    def category(self):
        return self.subcategory.category

    def save(self, *args, **kwargs):
        if not self.slug:
            base = self.name if not self.subtitle else f'{self.name} {self.subtitle}'
            self.slug = unique_slugify(self, base)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        verbose_name='Товар',
        related_name='images',
        on_delete=models.CASCADE,
    )
    image = models.ImageField('Изображение', upload_to='products/')
    alt = models.CharField('Alt-текст', max_length=255, blank=True)
    is_main = models.BooleanField('Главное', default=False)
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        ordering = ['-is_main', 'order', 'id']
        verbose_name = 'Фото товара'
        verbose_name_plural = 'Фото товаров'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # единственное главное фото на товар
        if self.is_main:
            ProductImage.objects.filter(product=self.product, is_main=True).exclude(pk=self.pk).update(is_main=False)

    def __str__(self):
        return f'{self.product.name} — фото {self.pk}'


class ProductSpec(models.Model):
    product = models.ForeignKey(
        Product,
        verbose_name='Товар',
        related_name='specs',
        on_delete=models.CASCADE,
    )
    label = models.CharField('Характеристика', max_length=255)
    value = models.CharField('Значение', max_length=512)
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Характеристика'
        verbose_name_plural = 'Характеристики'

    def __str__(self):
        return f'{self.label}: {self.value}'


class Order(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новая'),
        ('in_progress', 'В обработке'),
        ('done', 'Завершена'),
        ('cancelled', 'Отменена'),
    ]

    name = models.CharField('Имя', max_length=255)
    phone = models.CharField('Телефон', max_length=64)
    product = models.ForeignKey(
        Product,
        verbose_name='Товар',
        related_name='orders',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    comment = models.TextField('Комментарий', blank=True)
    status = models.CharField('Статус', max_length=32, choices=STATUS_CHOICES, default='new')
    created = models.DateTimeField('Создана', auto_now_add=True)

    class Meta:
        ordering = ['-created']
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'

    def __str__(self):
        return f'Заявка #{self.pk} — {self.name}'
