from django.contrib import admin

from .models import Category, Order, Product, ProductImage, ProductSpec, Subcategory


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0


class ProductSpecInline(admin.TabularInline):
    model = ProductSpec
    extra = 0


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order', 'is_active']
    prepopulated_fields = {'slug': ['name']}


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'slug', 'order', 'is_active']
    list_filter = ['category']
    prepopulated_fields = {'slug': ['name']}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'subtitle', 'subcategory', 'price', 'in_stock', 'is_active', 'is_featured']
    list_filter = ['subcategory__category', 'subcategory', 'is_active', 'is_featured', 'in_stock']
    search_fields = ['name', 'subtitle', 'description']
    inlines = [ProductImageInline, ProductSpecInline]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'phone', 'product', 'status', 'created']
    list_filter = ['status']
