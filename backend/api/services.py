import logging

from django.conf import settings
from django.core.mail import EmailMessage

logger = logging.getLogger(__name__)


def send_contact_email(contact_message) -> bool:
    """
    Sends a notification email when a new ContactMessage is created.
    Returns True if sent, False if it failed (never raises).
    """
    recipient = getattr(settings, "CONTACT_RECIPIENT_EMAIL", "") or getattr(
        settings, "EMAIL_HOST_USER", ""
    )
    if not recipient:
        logger.warning("Contact email skipped: no CONTACT_RECIPIENT_EMAIL configured")
        return False

    subject = f"Portfolio contact: {contact_message.subject or 'No subject'}"
    body = (
        f"New message from your portfolio contact form\n"
        f"--------------------------------------------\n"
        f"Name: {contact_message.name}\n"
        f"Email: {contact_message.email}\n"
        f"Subject: {contact_message.subject or '-'}\n"
        f"\n"
        f"{contact_message.message}\n"
    )

    try:
        EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient],
            reply_to=[contact_message.email],
        ).send(fail_silently=False)
        return True
    except Exception as exc:
        logger.error("Failed to send contact email to %s: %s", recipient, exc)
        return False
