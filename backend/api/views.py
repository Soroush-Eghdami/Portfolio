from django.db import connection
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import viewsets, generics, permissions, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import Skill, Project, Profile, ContactMessage
from .serializers import SkillSerializer, ProjectSerializer, ProfileSerializer, ContactMessageSerializer


class ContactRateThrottle(AnonRateThrottle):
    scope = "contact"


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["level"]
    search_fields = ["name"]
    ordering_fields = ["order", "name"]
    ordering = ["order", "name"]


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.filter(featured=True)
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["featured", "gradient"]
    search_fields = ["title", "description"]
    ordering_fields = ["order", "created_at", "title"]
    ordering = ["order", "-created_at"]


class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        obj, _ = Profile.objects.get_or_create(pk=1)
        return obj


class ContactMessageCreate(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ContactRateThrottle]


@extend_schema(
    tags=["health"],
    request=None,
    responses={
        200: OpenApiResponse(response=OpenApiTypes.OBJECT, description="Health check with DB status"),
        503: OpenApiResponse(response=OpenApiTypes.OBJECT, description="DB degraded"),
    },
)
@api_view(["GET"])
def health(request):
    try:
        connection.ensure_connection()
        db_status = "ok"
    except Exception as exc:
        return Response(
            {"status": "degraded", "service": "portfolio-api", "db": str(exc)},
            status=503,
        )
    return Response({"status": "ok", "service": "portfolio-api", "db": db_status})
