from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse

from .models import Book, Borrow
from .forms import RegisterForm, LoginForm

# ------------------ AUTH ------------------

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('dashboard')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')

# ------------------ USER DASHBOARD ------------------

@login_required
def dashboard_view(request):
    query = request.GET.get('q', '').strip()  # Get search query
    if query:
        available_books = Book.objects.filter(quantity__gt=0).filter(
            Q(title__icontains=query) | Q(author__icontains=query)
        )
    else:
        available_books = Book.objects.filter(quantity__gt=0)

    user_borrows = Borrow.objects.filter(user=request.user).exclude(status='returned')

    return render(request, 'dashboard.html', {
        'books': available_books,
        'borrows': user_borrows,
        'query': query
    })


@login_required
def request_borrow(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    if Borrow.objects.filter(user=request.user, book=book, status__in=['requested_borrow', 'borrowed']).exists():
        messages.error(request, f"You already requested or borrowed '{book.title}'")
    else:
        Borrow.objects.create(user=request.user, book=book)
        messages.success(request, f"Borrow request for '{book.title}' sent. Await admin approval.")
    return redirect('dashboard')


@login_required
def request_return(request, borrow_id):
    borrow = get_object_or_404(Borrow, id=borrow_id, user=request.user)
    if borrow.status != 'borrowed':
        messages.error(request, "Cannot return this book yet.")
    else:
        borrow.status = 'requested_return'
        borrow.save()
        messages.success(request, f"Return request for '{borrow.book.title}' sent. Await admin approval.")
    return redirect('dashboard')


@login_required
def borrows_json(request):
    borrows = Borrow.objects.filter(user=request.user).exclude(status="returned")
    data = {
        "borrows": [
            {
                "id": b.id,
                "book": b.book.title,
                "status": b.status,
                "borrowed_at": b.borrowed_at.strftime("%Y-%m-%d %H:%M:%S") if b.borrowed_at else None,
                "due_at": b.due_at.strftime("%Y-%m-%d %H:%M:%S") if b.due_at else None,
            }
            for b in borrows
        ]
    }
    return JsonResponse(data)


@login_required
def available_books_partial(request):
    """
    Return partial HTML for books list, filtered by search query if provided.
    """
    query = request.GET.get('q', '').strip()
    if query:
        books = Book.objects.filter(
            quantity__gt=0
        ).filter(
            Q(title__icontains=query) | Q(author__icontains=query)
        )
    else:
        books = Book.objects.filter(quantity__gt=0)

    return render(request, "partials/available_books_partial.html", {"books": books})


# ------------------ ADMIN ------------------

@staff_member_required
def admin_borrow_list(request):
    pending_borrows = Borrow.objects.filter(status='requested_borrow')
    return render(request, 'admin_borrow_list.html', {'borrows': pending_borrows})


@staff_member_required
def process_borrow(request, borrow_id):
    borrow = get_object_or_404(Borrow, id=borrow_id)
    book = borrow.book

    if borrow.status != 'requested_borrow':
        messages.error(request, "Invalid borrow request.")
    elif book.quantity == 0:
        messages.error(request, f"No copies of '{book.title}' available.")
    else:
        borrow.status = 'borrowed'
        book.quantity -= 1  # Reduce the quantity on borrow
        book.save()
        borrow.save()
        messages.success(request, f"Borrow approved for '{book.title}'")

    return redirect('admin_borrow_list')


@staff_member_required
def admin_return_list(request):
    pending_returns = Borrow.objects.filter(status='requested_return')
    return render(request, 'admin_return_list.html', {'borrows': pending_returns})


@staff_member_required
def process_return(request, borrow_id):
    borrow = get_object_or_404(Borrow, id=borrow_id)
    if borrow.status != 'requested_return':
        messages.error(request, "Invalid return request.")
    else:
        borrow.status = 'returned'
        borrow.book.quantity += 1
        borrow.book.save()
        borrow.save()
        messages.success(request, f"Return approved for '{borrow.book.title}'")
    return redirect('admin_return_list')
