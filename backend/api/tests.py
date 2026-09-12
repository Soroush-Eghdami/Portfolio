from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from unittest.mock import patch
from .models import Skill, Project, Profile, ContactMessage
from .services import send_contact_email


class HealthTests(TestCase):
    def test_health_ok(self):
        client = APIClient()
        resp = client.get("/api/health/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["status"], "ok")


class SkillTests(TestCase):
    def setUp(self):
        Skill.objects.create(name="Python", level="Advanced", icon="🐍", order=1)

    def test_list_skills(self):
        client = APIClient()
        resp = client.get("/api/skills/")
        self.assertEqual(resp.status_code, 200)
        data = resp.data.get("results", resp.data)
        self.assertTrue(len(data) >= 1)

    def test_search_filter(self):
        client = APIClient()
        resp = client.get("/api/skills/?search=Python")
        self.assertEqual(resp.status_code, 200)


class ProjectTests(TestCase):
    def setUp(self):
        Project.objects.create(
            title="Test Project",
            description="A test project",
            tags=["Python"],
            gradient="from-violet-600 to-indigo-600",
            featured=True,
        )

    def test_list_projects(self):
        client = APIClient()
        resp = client.get("/api/projects/")
        self.assertEqual(resp.status_code, 200)

    def test_filter_featured(self):
        client = APIClient()
        resp = client.get("/api/projects/?featured=true")
        self.assertEqual(resp.status_code, 200)


class ContactTests(TestCase):
    def test_create_contact_valid(self):
        client = APIClient()
        payload = {"name": "Test User", "email": "test@example.com", "message": "Hello this is a valid message with enough length."}
        resp = client.post("/api/contact/", payload, format="json")
        self.assertEqual(resp.status_code, 201)

    def test_create_contact_invalid_message_too_short(self):
        client = APIClient()
        payload = {"name": "A", "email": "bad", "message": "hi"}
        resp = client.post("/api/contact/", payload, format="json")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("name", resp.data)

    def test_contact_honeypot_like_spam(self):
        client = APIClient()
        payload = {
            "name": "Spammer",
            "email": "spam@example.com",
            "message": "Check https://a.com https://b.com https://c.com https://d.com link spam",
        }
        resp = client.post("/api/contact/", payload, format="json")
        self.assertEqual(resp.status_code, 400)

    def test_schema_exists(self):
        client = APIClient()
        resp = client.get("/api/schema/")
        self.assertEqual(resp.status_code, 200)


class ContactEmailTests(TestCase):
    def _msg(self):
        return ContactMessage.objects.create(
            name="Visitor",
            email="visitor@example.com",
            subject="Hello",
            message="This message is long enough to pass validation.",
        )

    @override_settings(
        EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
        CONTACT_RECIPIENT_EMAIL="me@example.com",
    )
    def test_send_contact_email_ok(self):
        from django.core import mail

        self.assertTrue(send_contact_email(self._msg()))
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("visitor@example.com", mail.outbox[0].reply_to)

    @override_settings(CONTACT_RECIPIENT_EMAIL="", EMAIL_HOST_USER="")
    def test_send_contact_email_no_recipient(self):
        self.assertFalse(send_contact_email(self._msg()))

    @override_settings(CONTACT_RECIPIENT_EMAIL="me@example.com")
    def test_send_contact_email_failure_returns_false(self):
        with patch("api.services.EmailMessage.send", side_effect=OSError("smtp down")):
            self.assertFalse(send_contact_email(self._msg()))

    @override_settings(
        EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
        CONTACT_RECIPIENT_EMAIL="me@example.com",
    )
    def test_contact_post_still_saves_when_email_ok(self):
        client = APIClient()
        payload = {"name": "Test User", "email": "test@example.com", "message": "Hello this is a valid message with enough length."}
        resp = client.post("/api/contact/", payload, format="json")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 1)
