const currentYearElm = document.getElementById("current-year");
let currentYear = new Date().getFullYear();

if (currentYear > 2025) {
    currentYear = `2025-${currentYear}`.toString();
}

currentYearElm.textContent = currentYear.toString();

// Add event listener to the button
const getStartedButton = document.getElementById("get-started");
const welcomeSection = document.getElementById("welcome-section");
const mainContent = document.getElementById("main-content");
const dateForm = document.getElementById("date-form");
const resultSection = document.getElementById("result-section");
const inputDate = document.getElementById("special-date");
let relashionshipInitialDate = -1;

// add scroll smooth behavior to the body
document.body.style.scrollBehavior = "smooth";

getStartedButton.addEventListener("click", async () => {
    // remove the "welcome-section" id from the with a transition of "fade-out"
    welcomeSection.classList.add("fade-out");
    // Show the main content section
    await new Promise(resolve => {
        // Wait for the animationend complete
        welcomeSection.addEventListener("animationend", resolve, { once: true });
    });

    mainContent.classList.remove("hidden");
    mainContent.classList.add("fade-in");
    // Scroll to the top of the main content section
    mainContent.scrollIntoView({ behavior: "smooth" });
});

welcomeSection.addEventListener("animationend", () => {
    welcomeSection.removeAttribute("id");
    welcomeSection.classList.remove("fade-out");
    // Add the 'hidden' class after the transition completes
    welcomeSection.classList.add("hidden");
}, { once: true });

document.addEventListener("DOMContentLoaded", function () {
    // User agent sniffing for basic mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // Setup for mobile (iOS/Android) - use native date picker
        inputDate.setAttribute("type", "date"); // Change input type to date

        inputDate.addEventListener("change", function (event) {
            if (event.target.value) {
                // The value from <input type="date"> is in 'YYYY-MM-DD' format.
                // Parse as local date to avoid timezone issues.
                const [year, month, day] = event.target.value.split('-').map(Number);
                relashionshipInitialDate = new Date(year, month - 1, day); // month is 0-indexed
            } else {
                relashionshipInitialDate = -1;
            }
        });

        inputDate.addEventListener("focus", function () {
            resultSection.classList.add("hidden"); // Hide the result section
            resultSection.classList.remove("fade-in"); // Ensure fade-in is removed
        });

    } else {
        // Setup for desktop - use flatpickr
        flatpickr("#special-date", {
            dateFormat: "Y-m-d", // Adjust the date format as needed
            onValueUpdate: function (selectedDates, dateStr, instance) {
                // Handle the date selection
                relashionshipInitialDate = selectedDates[0] ? selectedDates[0] : -1;
            },
            onOpen: function (selectedDates, dateStr, instance) {
                resultSection.classList.add("hidden"); // Hide the result section when the date picker opens
                resultSection.classList.remove("fade-in"); // Ensure fade-in is removed
            }
        });
    }
});

dateForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    if (relashionshipInitialDate === -1) {
        alert("Please select a valid date.");
        return;
    }

    days = calculateDaysBetweenDates(new Date(relashionshipInitialDate), new Date())
    // calculate the number of years
    const years = Math.floor(days / 365);
    // calculate the number of months
    const months = Math.floor((days % 365) / 30);
    // calculate the number of days
    const remainingDays = days % 30;
    // Display the result
    const result = document.getElementById("love-duration");
    if (years > 0) {
        result.innerHTML = `<p>${years} years</p><p>${months} months</p><p>${remainingDays} days</p>`;
    } else if (months > 0) {
        result.innerHTML = `<p>${months} months</p><p>${remainingDays} days</p>`;
    } else {
        result.innerHTML = `<p>${remainingDays} days</p>`;
    }

    document.getElementById("special-date").value = "";
    relashionshipInitialDate = -1; // Reset the date variable

    // Remove the "hidden" class from the result section
    resultSection.classList.remove("hidden");
    resultSection.classList.add("fade-in");
});

/**
 * Calculate the number of days between two dates.
 * @param {Date} date1 - The first date.
 * @param {Date} date2 - The second date.
 */
function calculateDaysBetweenDates(date1, date2) {
    const timeDifference = Math.abs(date2 - date1);
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
}