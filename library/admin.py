from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from django.utils.html import format_html
from django.utils import timezone
from django.contrib.admin import SimpleListFilter  # ✅ Add this import
from .models import Book, Borrow

# ------------------ USER ------------------

User = get_user_model()  # Custom User model


class OverdueFilter(SimpleListFilter):
    title = "Overdue"
    parameter_name = "overdue"

    def lookups(self, request, model_admin):
        return (
            ("yes", "Overdue"),
            ("no", "On Time"),
        )

    def queryset(self, request, queryset):
        now = timezone.now()
        if self.value() == "yes":
            # Borrowed books that are past due date
            return queryset.filter(status="borrowed", due_at__lt=now)
        if self.value() == "no":
            # Borrowed books that are still on time
            return queryset.exclude(status="borrowed", due_at__lt=now)
        return queryset

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin interface for the custom User model.
    """
    list_display = ("username", "email", "first_name", "last_name", "is_staff", "is_active")
    list_filter = ("is_staff", "is_superuser", "is_active")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("username",)

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "password1", "password2", "is_staff", "is_active"),
        }),
    )


# ------------------ BOOKS ------------------

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "isbn", "category", "borrow_days", "quantity")
    search_fields = ("title", "author", "isbn", "category")


# ------------------ BORROWS ------------------

@admin.register(Borrow)
class BorrowAdmin(admin.ModelAdmin):
    list_display = ("user", "book", "status", "borrowed_at", "return_by", "overdue_status")
    list_filter = ("status", OverdueFilter)
    search_fields = ("user__username", "book__title")

    def save_model(self, request, obj, form, change):
        if change:
            old = Borrow.objects.get(pk=obj.pk)

            # Approve borrow
            if old.status == "requested_borrow" and obj.status == "borrowed":
                obj.book.quantity -= 1
                obj.book.save()

            # Approve return
            if old.status == "requested_return" and obj.status == "returned":
                obj.book.quantity += 1
                obj.book.save()

        super().save_model(request, obj, form, change)

    # Display due date
    def return_by(self, obj):
        return obj.due_at.strftime("%Y-%m-%d %H:%M") if obj.due_at else "-"
    return_by.short_description = "Return By"

    # Display overdue status with color
    def overdue_status(self, obj):
        if obj.is_overdue:
            return format_html(
                "<span style='color:red;font-weight:bold;'>{}</span>",
                "⚠ OVERDUE"
            )
        return format_html(
            "<span style='color:green;'>{}</span>",
            "On Time"
        )
    overdue_status.short_description = "Status"
