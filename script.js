


const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("active");

        const isOpen = navMenu.classList.contains("active");

        menuToggle.setAttribute("aria-expanded", isOpen);
    });
}