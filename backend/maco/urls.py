from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "MaCo — Content administration"
admin.site.site_title = "MaCo CMS"
admin.site.index_title = "Website content"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("content.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
