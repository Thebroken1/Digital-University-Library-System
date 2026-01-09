from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # User actions
    path('borrow/<int:book_id>/', views.request_borrow, name='request_borrow'),
    path('return/<int:borrow_id>/', views.request_return, name='request_return'),
    path('borrows/json/', views.borrows_json, name='borrows_json'),
    path('available-books/', views.available_books_partial, name='available_books_partial'),


    # Admin actions
    path('admin/borrow/', views.admin_borrow_list, name='admin_borrow_list'),
    path('admin/borrow/<int:borrow_id>/process/', views.process_borrow, name='process_borrow'),
    path('admin/return/', views.admin_return_list, name='admin_return_list'),
    path('admin/return/<int:borrow_id>/process/', views.process_return, name='process_return'),
]
