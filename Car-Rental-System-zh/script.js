const BASE_URL = "https://678f630149875e5a1a919da0.mockapi.io/";

async function fetchCars() {
  try {
    const response = await fetch(`${BASE_URL}/cars`);
    const data = await response.json();
    cars = data;
    updateDashboard();
    renderCars();
  } catch (error) {
    console.error("Error fetching cars:", error);
    alert("Failed to load cars. Please try again.");
  }
}

async function addCarAPI(carData) {
  try {
    const response = await fetch(`${BASE_URL}/cars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding car:", error);
    throw new Error("Failed to add car");
  }
}

async function updateCarAPI(carId, carData) {
  try {
    const response = await fetch(`${BASE_URL}/cars/${carId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating car:", error);
    throw new Error("Failed to update car");
  }
}

async function deleteCarAPI(carId) {
  try {
    await fetch(`${BASE_URL}/cars/${carId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting car:", error);
    throw new Error("Failed to delete car");
  }
}

async function fetchRentals() {
  try {
    const response = await fetch(`${BASE_URL}/rentalData`);
    const data = await response.json();
    rentals = data;
    renderRentals();
  } catch (error) {
    console.error("Error fetching rentals:", error);
    alert("Failed to load rentals. Please try again.");
  }
}

async function addRentalAPI(rentalData) {
  try {
    const response = await fetch(`${BASE_URL}/rentalData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rentalData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding rental:", error);
    throw new Error("Failed to add rental");
  }
}

let cars = JSON.parse(localStorage.getItem("cars")) || [];
let rentals = JSON.parse(localStorage.getItem("rentals")) || [];

function saveData() {
  localStorage.setItem("cars", JSON.stringify(cars));
  localStorage.setItem("rentals", JSON.stringify(rentals));
}

const carImages = [
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600",
  "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1600",
  "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=1600",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1600",
];

function validateLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Define user credentials and their types
  const users = {
    "admin": { password: "1234", type: "admin" },
    "user": { password: "1234", type: "user" }
  };

  if (users[username] && users[username].password === password) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userType", users[username].type);
    localStorage.setItem("username", username);
    window.location.href = "index.html";
  } else {
    alert("Invalid credentials!");
  }
}

function checkLogin() {
  if (
    !localStorage.getItem("isLoggedIn") &&
    !window.location.href.includes("login.html")
  ) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}

async function addCar(event) {
  event.preventDefault();
  const model = document.getElementById("carModel").value;
  const image =
    document.getElementById("carImage").value ||
    carImages[Math.floor(Math.random() * carImages.length)];
  const price = document.getElementById("carPrice").value;

  const newCar = {
    model,
    image,
    price: Number(price),
    available: true,
  };

  try {
    await addCarAPI(newCar);
    alert(`Car "${model}" has been added successfully!`);
    document.getElementById("addCarForm").reset();
    closeModal();
    await fetchCars();
  } catch (error) {
    alert("Failed to add car. Please try again.");
  }
}

function renderCars() {
  const carGrid = document.getElementById("carGrid");
  if (!carGrid) return;

  carGrid.innerHTML = "";

  const availabilityFilter = document.getElementById("availabilityFilter");
  const filterValue = availabilityFilter ? availabilityFilter.value : "all";

  const filteredCars = cars.filter((car) => {
    if (filterValue === "available") return car.available;
    if (filterValue === "rented") return !car.available;
    return true;
  });

  if (filteredCars.length === 0) {
    carGrid.innerHTML = '<p class="no-results">No cars available.</p>';
    return;
  }

  filteredCars.forEach((car) => {
    const carCard = document.createElement("div");
    carCard.className = "car-card";
    carCard.innerHTML = `
      <img src="${car.image}" alt="${car.model}" onerror="this.src='${
      carImages[0]
    }'">
      <div class="car-info">
        <h3>${car.model}</h3>
        <p class="price">$${car.price} per day</p>
        <p class="status ${car.available ? "available" : "rented"}">
          ${car.available ? "● Available" : "● Currently Rented"}
        </p>
        <div class="car-actions">
          <button onclick="rentCar('${car.id}')" class="${
      car.available ? "rent-btn" : "return-btn"
    }">
            ${car.available ? "Rent Now" : "Return Car"}
          </button>
          <button onclick="deleteCar('${car.id}')" class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    carGrid.appendChild(carCard);
  });
}

function updateDashboard() {
  const totalCarsElement = document.getElementById("totalCars");
  const availableCarsElement = document.getElementById("availableCars");
  const rentedCarsElement = document.getElementById("rentedCars");

  if (totalCarsElement) {
    totalCarsElement.textContent = cars.length;
  }
  if (availableCarsElement) {
    availableCarsElement.textContent = cars.filter(
      (car) => car.available
    ).length;
  }
  if (rentedCarsElement) {
    rentedCarsElement.textContent = cars.filter((car) => !car.available).length;
  }
}

function showAddCarModal() {
  const userType = localStorage.getItem("userType");
  if (userType !== "admin") {
    alert("Only admin can add cars!");
    return;
  }
  document.getElementById("addCarModal").style.display = "block";
}

function closeModal() {
  document.getElementById("addCarModal").style.display = "none";
  document.getElementById("rentCarModal").style.display = "none";
}

function rentCar(carId) {
  const car = cars.find((c) => c.id === carId);
  if (!car) return;

  if (car.available) {
    const rentModal = document.getElementById("rentCarModal");
    const rentForm = document.getElementById("rentCarForm");

    rentForm.setAttribute("data-car-id", carId);
    rentForm.setAttribute("data-car-price", car.price);

    const modalTitle = rentModal.querySelector("h2");
    modalTitle.innerHTML = `<i class="fas fa-key"></i> Rent ${car.model}`;

    rentModal.style.display = "block";
  } else {
    returnCar(carId);
  }
}

async function processRental(event) {
  event.preventDefault();

  const form = event.target;
  const carId = form.getAttribute("data-car-id");
  const car = cars.find((c) => c.id === carId);

  if (!car) return;

  const rentalData = {
    carId: carId,
    carModel: car.model,
    customerName: form.querySelector('input[placeholder="Enter customer name"]')
      .value,
    phoneNumber: form.querySelector('input[placeholder="Enter phone number"]')
      .value,
    email: form.querySelector('input[placeholder="Enter email address"]').value,
    rentalDate: form.querySelector('input[type="date"]').value,
    numberOfDays: parseInt(
      form.querySelector('input[placeholder="Enter number of days"]').value
    ),
    totalPrice:
      car.price *
      parseInt(
        form.querySelector('input[placeholder="Enter number of days"]').value
      ),
    status: "active",
  };

  try {
    await addRentalAPI(rentalData);

    await updateCarAPI(carId, {
      ...car,
      available: false,
    });

    alert(`Car "${car.model}" has been rented successfully!`);
    form.reset();
    closeModal();

    await Promise.all([fetchCars(), fetchRentals()]);
  } catch (error) {
    console.error("Rental error:", error);
    alert("Failed to process rental. Please try again.");
  }
}

function renderRentals() {
  const rentalsList = document.getElementById("rentalsList");
  if (!rentalsList) return;

  rentalsList.innerHTML = "";

  rentals.forEach((rental) => {
    const rentalItem = document.createElement("div");
    rentalItem.className = "rental-item";
    rentalItem.innerHTML = `
            <div class="rental-info">
                <h3>${rental.carModel}</h3>
                <p>Customer: ${rental.customerName}</p>
                <p>Phone: ${rental.phoneNumber}</p>
                <p>Email: ${rental.email}</p>
                <p>Rental Date: ${rental.rentalDate}</p>
                <p>Duration: ${rental.numberOfDays} days</p>
                <p>Total Price: $${rental.totalPrice}</p>
            </div>
        `;
    rentalsList.appendChild(rentalItem);
  });
}

async function deleteCar(carId) {
  const userType = localStorage.getItem("userType");
  if (userType !== "admin") {
    alert("Only admin can delete cars!");
    return;
  }

  const car = cars.find((c) => c.id === carId);
  if (!car) return;

  const confirmDelete = confirm(`Are you sure you want to delete ${car.model}?`);

  if (confirmDelete) {
    try {
      await deleteCarAPI(carId);
      alert("Car has been deleted successfully!");
      await fetchCars();
    } catch (error) {
      alert("Failed to delete car. Please try again.");
    }
  }
}

async function returnCar(carId) {
  const car = cars.find((c) => c.id === carId);
  if (!car) return;

  if (confirm(`Confirm return of ${car.model}?`)) {
    try {
      await updateCarAPI(carId, { ...car, available: true });
      alert(`${car.model} has been returned successfully!`);
      await Promise.all([fetchCars(), fetchRentals()]);
    } catch (error) {
      alert("Failed to return car. Please try again.");
    }
  }
}

function searchCars() {
  const searchTerm = document.getElementById("searchCars").value.toLowerCase();
  const availabilityFilter =
    document.getElementById("availabilityFilter").value;

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.model.toLowerCase().includes(searchTerm);
    const matchesAvailability =
      availabilityFilter === "all"
        ? true
        : availabilityFilter === "available"
        ? car.available
        : !car.available;

    return matchesSearch && matchesAvailability;
  });

  renderFilteredCars(filteredCars);
}

function renderFilteredCars(filteredCars) {
  const carGrid = document.getElementById("carGrid");
  if (!carGrid) return;

  carGrid.innerHTML = "";

  if (filteredCars.length === 0) {
    carGrid.innerHTML =
      '<p class="no-results">No cars found matching your criteria.</p>';
    return;
  }

  filteredCars.forEach((car) => {
    const carCard = document.createElement("div");
    carCard.className = "car-card";
    carCard.innerHTML = `
            <img src="${car.image}" alt="${car.model}" onerror="this.src='${
      carImages[0]
    }'">
            <div class="car-info">
                <h3>${car.model}</h3>
                <p class="price">$${car.price} per day</p>
                <p class="status ${car.available ? "available" : "rented"}">
                    ${car.available ? "● Available" : "● Currently Rented"}
                </p>
                <div class="car-actions">
                    <button onclick="${
                      car.available
                        ? `rentCar(${car.id})`
                        : `returnCar(${car.id})`
                    }" 
                            class="${
                              car.available ? "rent-btn" : "return-btn"
                            }">
                        ${car.available ? "Rent Now" : "Return Car"}
                    </button>
                    <button onclick="deleteCar(${car.id})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    carGrid.appendChild(carCard);
  });
}

function checkUserType() {
  const userType = localStorage.getItem("userType");
  const username = localStorage.getItem("username");
  
  // Update username display
  const usernameDisplay = document.getElementById("display-username");
  if (usernameDisplay) {
    usernameDisplay.textContent = username;
  }

  // Hide admin-only features for regular users
  if (userType === "user") {
    const addCarBtn = document.querySelector(".add-car-btn");
    if (addCarBtn) addCarBtn.style.display = "none";
    
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(btn => btn.style.display = "none");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  checkLogin();
  checkUserType();

  await Promise.all([fetchCars(), fetchRentals()]);

  const addCarForm = document.getElementById("addCarForm");
  if (addCarForm) {
    addCarForm.addEventListener("submit", addCar);
  }

  const rentCarForm = document.getElementById("rentCarForm");
  if (rentCarForm) {
    rentCarForm.addEventListener("submit", processRental);
  }

  const searchInput = document.getElementById("searchCars");
  if (searchInput) {
    searchInput.addEventListener("input", searchCars);
  }

  const availabilityFilter = document.getElementById("availabilityFilter");
  if (availabilityFilter) {
    availabilityFilter.addEventListener("change", searchCars);
  }
});

window.onclick = function (event) {
  if (event.target.className === "modal") {
    closeModal();
  }
};

function redirectToCars() {
  window.location.href = "cars.html";
}
