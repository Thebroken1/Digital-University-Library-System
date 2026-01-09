from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta


# ---------------- USER ----------------

class User(AbstractUser):
    email = models.EmailField(unique=True)  # make email unique in DB

    def __str__(self):
        return self.username


# ---------------- BOOK ----------------

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)

    isbn = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        unique=True
    )
    category = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    # Admin sets default borrow duration (days)
    borrow_days = models.PositiveIntegerField(default=3)

    def __str__(self):
        return f"{self.title} by {self.author}"


# ---------------- BORROW ----------------

class Borrow(models.Model):
    STATUS_CHOICES = [
        ('requested_borrow', 'Requested Borrow'),
        ('borrowed', 'Borrowed'),
        ('requested_return', 'Requested Return'),
        ('returned', 'Returned'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='requested_borrow'
    )

    borrowed_at = models.DateTimeField(null=True, blank=True)
    due_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """
        When admin approves borrow:
        - set borrowed_at
        - calculate due_at using book.borrow_days
        """
        if self.status == "borrowed" and self.borrowed_at is None:
            self.borrowed_at = timezone.now()
            self.due_at = self.borrowed_at + timedelta(days=self.book.borrow_days)

        super().save(*args, **kwargs)

    @property
    def is_overdue(self):
        """
        Used in admin panel & frontend
        """
        return (
            self.status == "borrowed"
            and self.due_at is not None
            and timezone.now() > self.due_at
        )

    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.get_status_display()})"
