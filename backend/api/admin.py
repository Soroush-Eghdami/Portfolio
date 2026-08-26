from django.contrib import admin
from .models import Skill, Project, Profile, ContactMessage

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "level", "order")
    list_editable = ("order",)
    list_filter = ("level",)
    search_fields = ("name",)
    ordering = ("order", "name")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "featured", "order", "created_at")
    list_filter = ("featured", "gradient")
    list_editable = ("order", "featured")
    search_fields = ("title", "description")
    ordering = ("order", "-created_at")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "email", "updated_at")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at")
    readonly_fields = ("created_at",)
    search_fields = ("name", "email", "subject", "message")
    list_filter = ("created_at",)
    date_hierarchy = "created_at"
    ordering = ("-created_at",)
