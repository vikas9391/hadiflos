from django.db import models
from django.utils import timezone


class Claim(models.Model):
    """A debt recovery claim submitted via the website form."""

    class DebtType(models.TextChoices):
        COMMERCIAL = 'commercial', 'Commercial Debt'
        INVOICE = 'invoice', 'Invoice Unpaid'
        LOAN = 'loan', 'Loan Default'
        LEASE = 'lease', 'Lease / Rent'
        OTHER = 'other', 'Other'

    class Status(models.TextChoices):
        NEW = 'new', 'New'
        UNDER_REVIEW = 'review', 'Under Review'
        IN_PROGRESS = 'in_progress', 'In Progress'
        NEGOTIATION = 'negotiation', 'Negotiation'
        LEGAL = 'legal', 'Legal Proceedings'
        SETTLED = 'settled', 'Settled'
        CLOSED = 'closed', 'Closed'

    class Language(models.TextChoices):
        FRENCH = 'fr', 'Français'
        ENGLISH = 'en', 'English'
        ARABIC = 'ar', 'العربية'

    # Claimant info
    full_name = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=30)

    # Debt info
    debtor_name = models.CharField(max_length=200)
    debtor_location = models.CharField(max_length=200)
    amount_owed = models.DecimalField(max_digits=14, decimal_places=2)
    debt_type = models.CharField(max_length=20, choices=DebtType.choices)
    description = models.TextField()

    # Preferences
    preferred_language = models.CharField(
        max_length=2, choices=Language.choices, default=Language.FRENCH
    )

    # Internal tracking
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NEW
    )
    assigned_agent = models.CharField(max_length=200, blank=True)
    internal_notes = models.TextField(blank=True)
    reference_number = models.CharField(max_length=20, unique=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    contacted_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Claim'
        verbose_name_plural = 'Claims'

    def __str__(self):
        return f"[{self.reference_number}] {self.full_name} – {self.amount_owed} MAD"

    def save(self, *args, **kwargs):
        if not self.reference_number:
            import random
            import string
            self.reference_number = 'HFC-' + ''.join(
                random.choices(string.digits, k=6)
            )
        super().save(*args, **kwargs)


class ContactMessage(models.Model):
    """General contact messages (not a full claim)."""
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} – {self.email}"
