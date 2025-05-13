from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home, name='home'),
    path('cars/', views.cars, name='cars'),
    path('about/', views.about, name='about'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('add_car/', views.add_car, name='add_car'),
    path('rent_car/<int:car_id>/', views.rent_car, name='rent_car'),
    path('return_car/<int:car_id>/', views.return_car, name='return_car'),
    path('delete_car/<int:car_id>/', views.delete_car, name='delete_car'),
]
