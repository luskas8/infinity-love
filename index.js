const currentYearElm = document.getElementById("current-year");
let currentYear = new Date().getFullYear();

if (currentYear > 2025) {
    currentYear = `2025-${currentYear}`.toString();
}

currentYearElm.textContent = currentYear.toString();

// Add event listener to the button
const getStartedButton = document.getElementById("get-started");
const welcomeModal = document.getElementById("welcome-modal");
const mainContent = document.getElementById("main-content");
const dateForm = document.getElementById("date-form");
const resultSection = document.getElementById("result-section");
const inputDate = document.getElementById("special-date");
const languageSelector = document.getElementById("language-selector");
const infoIcon = document.querySelector("#info-icon-container svg");
let relashionshipInitialDate = -1;
let translations = {};

// add scroll smooth behavior to the body
document.body.style.scrollBehavior = "smooth";

getStartedButton.addEventListener("click", async () => {
    await modalDisappear(welcomeModal)
});

/** * Function to handle the appearance of the modal with a fade-in effect.
 * @param {HTMLElement | null} modal 
 */
async function modalAppear(modal) {
    modal.classList.remove("hidden");
    modal.classList.add("fade-in");
    await new Promise(resolve => {
        // Wait for the animationend complete
        modal.addEventListener("animationend", resolve, { once: true });
    });
    modal.classList.remove("hidden");
    modal.classList.add("fade-in");
    // Scroll to the top of the modal
    modal.scrollIntoView({ behavior: "smooth" });
}

/** Function to handle the disappearance of the modal with a fade-out effect.
 * @param {HTMLElement | null} modal
 */
async function modalDisappear(modal) {
    modal.classList.add("fade-out");
    await new Promise(resolve => {
        // Wait for the animationend complete
        modal.addEventListener("animationend", resolve, { once: true });
    });
    modal.classList.add("hidden");
    modal.classList.remove("fade-out");
}

welcomeModal.addEventListener("animationend", () => {
    welcomeModal.classList.remove("fade-out");
}, { once: true });

// Add event listener for the info icon
infoIcon.addEventListener("click", async () => {
    await modalAppear(welcomeModal);
});

welcomeModal.addEventListener("click", async (event) => {
    // Check if the click is outside the modal content
    if (event.target === welcomeModal) {
        await modalDisappear(welcomeModal);
    }
})

// Add event listener for the language selector
languageSelector.addEventListener("change", async (event) => {
    const selectedLanguage = event.target.value;
    await initializeLanguage(selectedLanguage);
});

async function loadTranslations(lang) {
    try {
        const response = await fetch(`./locates/${lang}.json`);
        translations = await response.json();
    } catch (error) {
        console.error(`Error loading translations for ${lang}:`, error);
        translations = {}; // Fallback to empty object
    }
}

function translate(key) {
    return translations[key] || key; // Return translation or the key if not found
}
async function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = translate(key);
    });
}

// Function to initialize the language
async function initializeLanguage(lang) {
    await loadTranslations(lang);
    await updateContent();
}

document.addEventListener("DOMContentLoaded", async function () {
    // Determine the language (e.g., from browser settings or a default)
    const language = navigator.language.split('-')[0] || 'en'; // Default to English

    await initializeLanguage(language);

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
            maxDate: "today",
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
        result.innerHTML = `<p>${years} ${translations.years}</p><p>${months} ${translations.months}</p><p>${remainingDays} ${translations.days}</p>`;
    } else if (months > 0) {
        result.innerHTML = `<p>${months} ${translations.months}</p><p>${remainingDays} ${translations.days}</p>`;
    } else {
        result.innerHTML = `<p>${remainingDays} ${translations.days}</p>`;
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
