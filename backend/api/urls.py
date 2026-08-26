from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter

from .views import SkillViewSet, ProjectViewSet, ProfileView, ContactMessageCreate, health

router = DefaultRouter()
router.register(r"skills", SkillViewSet, basename="skill")
router.register(r"projects", ProjectViewSet, basename="project")

urlpatterns = [
    path("", include(router.urls)),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("contact/", ContactMessageCreate.as_view(), name="contact"),
    path("health/", health, name="health"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
