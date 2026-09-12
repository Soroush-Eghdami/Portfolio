from rest_framework import serializers
from .models import Skill, Project, Profile, ContactMessage

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "level", "icon", "order"]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "title", "description", "tags", "stack", "gradient", "emoji", "cover", "demo_url", "code_url", "featured", "order"]

    def validate_tags(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Tags must be a list.")
        if len(value) > 10:
            raise serializers.ValidationError("At most 10 tags allowed.")
        for t in value:
            if not isinstance(t, str):
                raise serializers.ValidationError("Each tag must be a string.")
            if len(t) > 30:
                raise serializers.ValidationError("Each tag must be at most 30 characters.")
        return value

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "name", "role", "bio", "location", "email", "phone", "github", "linkedin", "twitter", "cv"]

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message", "created_at"]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "name": {"required": True, "allow_blank": False},
            "email": {"required": True, "allow_blank": False},
            "message": {"required": True, "allow_blank": False},
            "subject": {"required": False, "allow_blank": True},
        }

    def validate_name(self, value):
        v = value.strip()
        if len(v) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        if len(v) > 100:
            raise serializers.ValidationError("Name must be at most 100 characters.")
        return v

    def validate_subject(self, value):
        if value and len(value) > 200:
            raise serializers.ValidationError("Subject must be at most 200 characters.")
        return value.strip() if value else value

    def validate_message(self, value):
        v = value.strip()
        if len(v) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        if len(v) > 5000:
            raise serializers.ValidationError("Message must be at most 5000 characters.")
        # basic spam heuristic: reject excessive links
        if v.count("http://") + v.count("https://") > 3:
            raise serializers.ValidationError("Too many links in message.")
        return v
