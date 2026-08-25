from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Skill, Project, Profile, ContactMessage
from .serializers import SkillSerializer, ProjectSerializer, ProfileSerializer, ContactMessageSerializer

class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.filter(featured=True)
    serializer_class = ProjectSerializer
    filterset_fields = ["featured"]

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        obj, _ = Profile.objects.get_or_create(pk=1)
        return obj

class ContactMessageCreate(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

@api_view(["GET"])
def health(request):
    return Response({"status": "ok", "service": "portfolio-api"})
