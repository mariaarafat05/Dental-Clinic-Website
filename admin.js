const loginSection = document.querySelector("#login-section");
const dashboardSection = document.querySelector("#dashboard-section");

const loginForm = document.querySelector("#login-form");
const adminPassword = document.querySelector("#admin-password");
const loginMessage = document.querySelector("#login-message");

const logoutButton = document.querySelector("#logout-button");
const bookingsTable = document.querySelector("#bookings-table");
const bookingCount = document.querySelector("#booking-count");
const errorMessage = document.querySelector("#error-message");

const API_URL = "https://dental-clinic-website-5.onrender.com";

async function loadBookings() {
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            credentials: "include"
        });

        if (response.status === 401) {
            showLogin();
            return;
        }

        if (!response.ok) {
            throw new Error("Could not load appointments.");
        }

        const bookings = await response.json();

        bookingsTable.replaceChildren();
        bookingCount.textContent = `Total Appointments: ${bookings.length}`;
        errorMessage.textContent = "";

        if (bookings.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 6;
            cell.textContent = "No appointments found.";

            row.appendChild(cell);
            bookingsTable.appendChild(row);
            return;
        }

        bookings.forEach((booking) => {
            const row = document.createElement("tr");

            const values = [
                booking.id,
                booking.name,
                booking.phone,
                booking.date,
                booking.time,
                booking.message || "-"
            ];

            values.forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            bookingsTable.appendChild(row);
        });

        loginSection.hidden = true;
        dashboardSection.hidden = false;

    } catch (error) {
        console.error(error);
        errorMessage.textContent =
            "Could not connect to the server. Make sure it is running.";
    }
}

function showLogin() {
    dashboardSection.hidden = true;
    loginSection.hidden = false;
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginMessage.textContent = "Checking password...";

    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                password: adminPassword.value
            })
        });


        const result = await response.json();

        if (!response.ok) {
            loginMessage.textContent = result.message || "Incorrect password.";
            return;
        }

        adminPassword.value = "";
        loginMessage.textContent = "";

        await loadBookings();

    } catch (error) {
        console.error(error);
        loginMessage.textContent =
            "Could not connect to the server. Make sure it is running.";
    }
});

logoutButton.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_URL}/admin/logout`, {
            method: "POST",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Logout failed.");
        }

        bookingsTable.replaceChildren();
        bookingCount.textContent = "";
        errorMessage.textContent = "";
        showLogin();

        loginMessage.textContent = "You have logged out successfully.";

    } catch (error) {
        console.error(error);
        errorMessage.textContent = "Could not log out. Please try again.";
    }
});

showLogin();
