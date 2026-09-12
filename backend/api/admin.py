from django.contrib import admin
from django.utils.html import format_html
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
    list_display = ("title", "emoji", "featured", "order", "created_at")
    list_filter = ("featured", "gradient")
    list_editable = ("order", "featured")
    search_fields = ("title", "description")
    ordering = ("order", "-created_at")
    readonly_fields = ("cover_preview",)
    fields = ("title", "description", "tags", "stack", "gradient", "emoji", "cover", "cover_preview", "demo_url", "code_url", "featured", "order")

    @admin.display(description="Cover preview")
    def cover_preview(self, obj):
        if obj.cover:
            return format_html('<img src="{}" style="max-height: 160px; border-radius: 12px;" />', obj.cover.url)
        return "No cover — emoji fallback is shown"


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "email", "updated_at")
    fields = ("name", "role", "bio", "location", "email", "phone", "cv", "github", "linkedin", "twitter")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at")
    readonly_fields = ("created_at",)
    search_fields = ("name", "email", "subject", "message")
    list_filter = ("created_at",)
    date_hierarchy = "created_at"
    ordering = ("-created_at",)
