from django.db.models import Count, Prefetch, Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Order, Product, ProductImage, Subcategory
from .permissions import IsAdminOrReadOnly
from .serializers import (
    CategorySerializer,
    CategoryWriteSerializer,
    OrderSerializer,
    ProductDetailSerializer,
    ProductImageSerializer,
    ProductImageWriteSerializer,
    ProductListSerializer,
    ProductWriteSerializer,
    SubcategorySerializer,
    SubcategoryWriteSerializer,
)
from .telegram import notify_order

ORDERING_WHITELIST = {
    'price', '-price', 'created_at', '-created_at', 'name', '-name', 'order', '-order',
}


class CategoryViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = None

    def get_queryset(self):
        qs = Category.objects.annotate(
            products_count=Count('subcategories__products', distinct=True),
        ).prefetch_related(
            Prefetch('subcategories', queryset=Subcategory.objects.annotate(
                products_count=Count('products', distinct=True),
            )),
        )
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return CategoryWriteSerializer
        return CategorySerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.subcategories.exists():
            return Response(
                {'detail': 'Нельзя удалить категорию: в ней есть подкатегории. Сначала удалите или перенесите их.'},
                status=status.HTTP_409_CONFLICT,
            )
        return super().destroy(request, *args, **kwargs)


class SubcategoryViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = None

    def get_queryset(self):
        qs = Subcategory.objects.select_related('category').annotate(
            products_count=Count('products', distinct=True),
        )
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True, category__is_active=True)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__slug=category)
        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return SubcategoryWriteSerializer
        return SubcategorySerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.products.exists():
            return Response(
                {'detail': 'Нельзя удалить подкатегорию: в ней есть товары. Сначала удалите или перенесите их.'},
                status=status.HTTP_409_CONFLICT,
            )
        return super().destroy(request, *args, **kwargs)


class ProductViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = Product.objects.select_related('subcategory__category').prefetch_related('images', 'specs')
        params = self.request.query_params

        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(is_active=True, subcategory__is_active=True, subcategory__category__is_active=True)

        category = params.get('category')
        if category:
            qs = qs.filter(subcategory__category__slug=category)

        subcategory = params.get('subcategory')
        if subcategory:
            qs = qs.filter(subcategory__slug=subcategory)

        if params.get('featured') in ('true', '1'):
            qs = qs.filter(is_featured=True)

        if params.get('in_stock') in ('true', '1'):
            qs = qs.filter(in_stock=True)

        search = params.get('search')
        if search:
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(subtitle__icontains=search)
                | Q(description__icontains=search)
            )

        ordering = params.get('ordering')
        if ordering in ORDERING_WHITELIST:
            qs = qs.order_by(ordering)

        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return ProductWriteSerializer
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def upload_image(self, request, slug=None):
        """Загрузка одного фото в галерею товара (multipart: image, alt?, is_main?)."""
        product = self.get_object()
        image = request.FILES.get('image')
        if not image:
            return Response({'detail': 'Файл image обязателен.'}, status=status.HTTP_400_BAD_REQUEST)
        product_image = ProductImage.objects.create(
            product=product,
            image=image,
            alt=request.data.get('alt', product.name),
            is_main=request.data.get('is_main') in ('true', '1', True),
            order=product.images.count(),
        )
        return Response(
            ProductImageSerializer(product_image, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class ProductImageViewSet(viewsets.ModelViewSet):
    """Управление фотографиями галереи (удаление, выбор главного, порядок)."""
    queryset = ProductImage.objects.select_related('product')
    serializer_class = ProductImageWriteSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    http_method_names = ['get', 'patch', 'delete', 'head', 'options']
    pagination_class = None


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related('product').all()
    serializer_class = OrderSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        qs = Order.objects.select_related('product').all()
        params = self.request.query_params

        status_param = params.get('status')
        valid_statuses = {choice[0] for choice in Order.STATUS_CHOICES}
        if status_param in valid_statuses:
            qs = qs.filter(status=status_param)

        search = params.get('search')
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(phone__icontains=search))

        return qs

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        order = serializer.save()
        notify_order(order)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
        })
