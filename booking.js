const bookingForm = document.querySelector("#booking-form");

bookingForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.querySelector(".booking-name").value.trim();
    const phone = document.querySelector(".booking-phone").value.trim();
    const date = document.querySelector(".booking-date").value;
    const time = document.querySelector(".booking-time").value;
    const message = document.querySelector(".booking-message").value.trim();

    try {
        const response = await fetch("https://dental-clinic-website-5.onrender.com/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                phone,
                date,
                time,
                message
            })
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message);
            return;
        }

        alert("Your appointment booking was received successfully!");
        bookingForm.reset();

    } catch (error) {
        console.error("Booking error:", error);
        alert("Error details: " + error.message);
    }
});