from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ClientViewSet,
    ContactCreateView,
    ProductViewSet,
    ProjectViewSet,
    ServiceViewSet,
    SiteSettingsView,
)

router = DefaultRouter()
router.register("services", ServiceViewSet, basename="service")
router.register("projects", ProjectViewSet, basename="project")
router.register("products", ProductViewSet, basename="product")
router.register("clients", ClientViewSet, basename="client")

urlpatterns = [
    path("settings/", SiteSettingsView.as_view(), name="site-settings"),
    path("contact/", ContactCreateView.as_view(), name="contact-create"),
    path("", include(router.urls)),
]
