from django.urls import path, include
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
]
