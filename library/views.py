from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from .models import Book, Borrow
from .forms import RegisterForm, LoginForm
from django.contrib import messages

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})

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

@login_required
def dashboard_view(request):
    query = request.GET.get('q')
    if query:
        books = Book.objects.filter(title__icontains=query) | Book.objects.filter(author__icontains=query)
    else:
        books = Book.objects.all()
    borrows = Borrow.objects.filter(user=request.user, returned=False)
    return render(request, 'dashboard.html', {'books': books, 'borrows': borrows, 'query': query})

@login_required
def borrow_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    if book.quantity > 0:
        book.quantity -= 1
        book.save()
        Borrow.objects.create(user=request.user, book=book)
        messages.success(request, f"You borrowed '{book.title}'")
    else:
        messages.error(request, f"'{book.title}' is not available")
    return redirect('dashboard')

@login_required
def return_book(request, borrow_id):
    borrow = get_object_or_404(Borrow, id=borrow_id, user=request.user, returned=False)
    borrow.returned = True
    borrow.book.quantity += 1
    borrow.book.save()
    borrow.save()
    messages.success(request, f"You returned '{borrow.book.title}'")
    return redirect('dashboard')
