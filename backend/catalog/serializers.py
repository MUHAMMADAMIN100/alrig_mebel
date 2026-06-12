import json

from rest_framework import serializers

from .models import Category, Order, Product, ProductImage, ProductSpec, Subcategory


# ─────────────────────────── вспомогательные поля ───────────────────────────

class FormBooleanField(serializers.BooleanField):
    """
    BooleanField, уважающий default при multipart/form-data.

    Стандартный DRF BooleanField трактует отсутствие поля в HTML-форме как False
    (семантика чекбокса) — из-за этого товар, созданный через multipart без
    is_active, молча становился неактивным. Здесь отсутствие = default.
    """
    default_empty_html = serializers.empty


class SpecsField(serializers.Field):
    """Список характеристик. Принимает list или JSON-строку (multipart)."""

    def to_internal_value(self, data):
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except (TypeError, ValueError):
                raise serializers.ValidationError('Ожидается JSON-массив характеристик.')
        if not isinstance(data, list):
            raise serializers.ValidationError('Ожидается список характеристик.')
        result = []
        for i, item in enumerate(data):
            if not isinstance(item, dict) or not item.get('label') or not str(item.get('value', '')).strip():
                raise serializers.ValidationError(
                    f'Характеристика #{i + 1}: нужны непустые поля label и value.'
                )
            result.append({
                'label': str(item['label']).strip(),
                'value': str(item['value']).strip(),
            })
        return result

    def to_representation(self, value):
        return value


# ─────────────────────────────── чтение ───────────────────────────────

class ProductSpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpec
        fields = ['id', 'label', 'value', 'order']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt', 'is_main', 'order']


class CategoryMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class SubcategoryMiniSerializer(serializers.ModelSerializer):
    category = CategoryMiniSerializer(read_only=True)

    class Meta:
        model = Subcategory
        fields = ['id', 'name', 'slug', 'category']


class SubcategorySerializer(serializers.ModelSerializer):
    category = CategoryMiniSerializer(read_only=True)
    products_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Subcategory
        fields = [
            'id', 'name', 'slug', 'image', 'order', 'is_active',
            'category', 'products_count', 'created_at', 'updated_at',
        ]


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    products_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'image', 'order', 'is_active',
            'subcategories', 'products_count', 'created_at', 'updated_at',
        ]

    def get_subcategories(self, obj):
        request = self.context.get('request')
        subs = obj.subcategories.all()
        if not (request and request.user and request.user.is_staff):
            subs = [s for s in subs if s.is_active]
        return SubcategorySerializer(subs, many=True, context=self.context).data


class ProductListSerializer(serializers.ModelSerializer):
    subcategory = SubcategoryMiniSerializer(read_only=True)
    category = CategoryMiniSerializer(read_only=True)
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'subtitle', 'price', 'old_price', 'currency',
            'in_stock', 'is_active', 'is_featured', 'order',
            'subcategory', 'category', 'main_image', 'created_at',
        ]

    def get_main_image(self, obj):
        images = list(obj.images.all())
        if not images:
            return None
        main = next((img for img in images if img.is_main), images[0])
        return ProductImageSerializer(main, context=self.context).data


class ProductDetailSerializer(ProductListSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    specs = ProductSpecSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ['description', 'images', 'specs', 'updated_at']


# ─────────────────────────────── запись ───────────────────────────────

class CategoryWriteSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)
    is_active = FormBooleanField(default=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'order', 'is_active']

    def validate_slug(self, value):
        return value or ''

    def to_representation(self, instance):
        return CategorySerializer(instance, context=self.context).data


class SubcategoryWriteSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)
    is_active = FormBooleanField(default=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Subcategory
        fields = ['id', 'name', 'slug', 'image', 'category', 'order', 'is_active']

    def validate_slug(self, value):
        return value or ''

    def to_representation(self, instance):
        return SubcategorySerializer(instance, context=self.context).data


class ProductWriteSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)
    subcategory = serializers.PrimaryKeyRelatedField(queryset=Subcategory.objects.all())
    is_active = FormBooleanField(default=True)
    in_stock = FormBooleanField(default=True)
    is_featured = FormBooleanField(default=False)
    specs = SpecsField(required=False)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), required=False, write_only=True,
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'subtitle', 'description', 'subcategory',
            'price', 'old_price', 'currency', 'in_stock', 'is_active',
            'is_featured', 'order', 'specs', 'uploaded_images',
        ]

    def validate_slug(self, value):
        return value or ''

    def _save_specs(self, product, specs):
        product.specs.all().delete()
        ProductSpec.objects.bulk_create([
            ProductSpec(product=product, label=s['label'], value=s['value'], order=i)
            for i, s in enumerate(specs)
        ])

    def _save_images(self, product, files):
        has_main = product.images.filter(is_main=True).exists()
        start_order = product.images.count()
        for i, f in enumerate(files):
            ProductImage.objects.create(
                product=product,
                image=f,
                alt=product.name,
                is_main=(not has_main and i == 0),
                order=start_order + i,
            )

    def create(self, validated_data):
        specs = validated_data.pop('specs', None)
        files = validated_data.pop('uploaded_images', None)
        product = super().create(validated_data)
        if specs is not None:
            self._save_specs(product, specs)
        if files:
            self._save_images(product, files)
        return product

    def update(self, instance, validated_data):
        specs = validated_data.pop('specs', None)
        files = validated_data.pop('uploaded_images', None)
        product = super().update(instance, validated_data)
        if specs is not None:
            self._save_specs(product, specs)
        if files:
            self._save_images(product, files)
        return product

    def to_representation(self, instance):
        return ProductDetailSerializer(instance, context=self.context).data


class ProductImageWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image', 'alt', 'is_main', 'order']


# ─────────────────────────────── заявки ───────────────────────────────

class OrderProductMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'subtitle']


class OrderSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), required=False, allow_null=True,
    )
    product_detail = OrderProductMiniSerializer(source='product', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'name', 'phone', 'product', 'product_detail', 'comment', 'status', 'created']
        read_only_fields = ['created']
