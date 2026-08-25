from django.db import models

class Skill(models.Model):
    LEVEL_CHOICES = [("Beginner", "Beginner"), ("Intermediate", "Intermediate"), ("Advanced", "Advanced")]
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="Intermediate")
    icon = models.CharField(max_length=10, blank=True, default="◆")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.name} ({self.level})"


class Project(models.Model):
    GRADIENT_CHOICES = [
        ("from-violet-600 to-indigo-600", "Violet → Indigo"),
        ("from-fuchsia-600 to-pink-600", "Fuchsia → Pink"),
        ("from-cyan-500 to-blue-600", "Cyan → Blue"),
        ("from-emerald-500 to-teal-600", "Emerald → Teal"),
        ("from-orange-500 to-red-600", "Orange → Red"),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    tags = models.JSONField(default=list, blank=True, help_text="List of tags e.g. ['React','Tailwind']")
    gradient = models.CharField(max_length=100, choices=GRADIENT_CHOICES, default="from-violet-600 to-indigo-600")
    demo_url = models.URLField(blank=True, default="#")
    code_url = models.URLField(blank=True, default="#")
    featured = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title


class Profile(models.Model):
    name = models.CharField(max_length=100, default="Soroush Eghdami")
    role = models.CharField(max_length=100, default="Python Backend Developer")
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True, default="404: Not Found")
    email = models.EmailField(blank=True, default="Soroush.egh@gmail.com")
    phone = models.CharField(max_length=30, blank=True, default="")
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} <{self.email}> - {self.subject or 'No subject'}"
