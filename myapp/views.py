from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Car, Customer, Rental, CustomUser
from django.contrib.admin.views.decorators import staff_member_required
from decimal import Decimal

def login_view(request):
    next_url = request.GET.get('next', 'home')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(next_url)
        else:
            messages.error(request, 'Invalid credentials!')
    return render(request, 'myapp/login.html', {'next': next_url})

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def home(request):
    cars = Car.objects.all()
    available_cars = cars.filter(available=True).count()
    rented_cars = cars.filter(available=False).count()
    context = {
        'total_cars': cars.count(),
        'available_cars': available_cars,
        'rented_cars': rented_cars,
    }
    return render(request, 'myapp/index.html', context)

@login_required
def cars(request):
    cars = Car.objects.all()
    rentals = Rental.objects.filter(status='active')
    context = {
        'cars': cars,
        'rentals': rentals,
    }
    return render(request, 'myapp/cars.html', context)

@login_required
def about(request):
    return render(request, 'myapp/about.html')

@staff_member_required
def add_car(request):
    if request.method == 'POST':
        model = request.POST.get('carModel')
        image = request.FILES.get('carImage')
        price = request.POST.get('carPrice')
        
        car = Car.objects.create(
            model=model,
            image=image,
            price_per_day=Decimal(price),
            created_by=request.user
        )
        messages.success(request, f'Car "{model}" has been added successfully!')
        return redirect('cars')
    return redirect('cars')

@login_required
def rent_car(request, car_id):
    car = get_object_or_404(Car, id=car_id)
    if request.method == 'POST':
        customer_name = request.POST.get('customerName')
        phone_number = request.POST.get('phoneNumber')
        email = request.POST.get('email')
        rental_date = request.POST.get('rentalDate')
        number_of_days = int(request.POST.get('numberOfDays'))
        
        customer = Customer.objects.create(
            name=customer_name,
            phone_number=phone_number,
            email=email
        )
        
        total_price = car.price_per_day * Decimal(number_of_days)
        
        Rental.objects.create(
            car=car,
            customer=customer,
            rental_date=rental_date,
            number_of_days=number_of_days,
            total_price=total_price
        )
        
        car.available = False
        car.save()
        
        messages.success(request, f'Car "{car.model}" has been rented successfully!')
        return redirect('cars')
    return redirect('cars')

@login_required
def return_car(request, car_id):
    car = get_object_or_404(Car, id=car_id)
    rental = Rental.objects.filter(car=car, status='active').first()
    
    if rental:
        rental.status = 'completed'
        rental.save()
        car.available = True
        car.save()
        messages.success(request, f'{car.model} has been returned successfully!')
    
    return redirect('cars')

@staff_member_required
def delete_car(request, car_id):
    car = get_object_or_404(Car, id=car_id)
    car.delete()
    messages.success(request, 'Car has been deleted successfully!')
    return redirect('cars')


