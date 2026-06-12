from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title='ALRIG API',
        default_version='v1',
        description='API каталога бытовой техники ALRIG (alrig.tj)',
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/', include('catalog.urls')),
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
]

if not settings.USE_S3:
    # static() — no-op при DEBUG=False, поэтому медиа раздаём явно и в проде
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
