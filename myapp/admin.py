from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Role, Car, Customer, Rental

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'is_staff', 'created_at')
    list_filter = ('user_type', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('user_type', 'role', 'created_at')}),
    )

class CarAdmin(admin.ModelAdmin):
    list_display = ('model', 'price_per_day', 'available', 'created_by', 'created_at')
    list_filter = ('available', 'created_at')
    search_fields = ('model',)

class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'email', 'created_at')
    search_fields = ('name', 'email')

class RentalAdmin(admin.ModelAdmin):
    list_display = ('customer', 'car', 'rental_date', 'number_of_days', 'total_price', 'status')
    list_filter = ('status', 'rental_date')
    search_fields = ('customer__name', 'car__model')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Role)
admin.site.register(Car, CarAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Rental, RentalAdmin)
