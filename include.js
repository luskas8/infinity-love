function includeHTML(resolve) {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML(resolve); // Recursive call to process next include or finish
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function after finding and processing one include.
         The recursive call will handle subsequent ones. */
      return;
    }
  }
  // If the loop completes without finding any "w3-include-html" attributes,
  // all includes are done.
  resolve();
}

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

document.addEventListener("DOMContentLoaded", async function() {
  const promise = new Promise((resolve) => {
    includeHTML(resolve);
  });
  await promise;

  const languageSelector = document.getElementById("language-selector");
  const infoIcon = document.querySelector("#info-icon-container svg");
  const welcomeModal = document.getElementById("welcome-modal");
  const closeModalButton = document.getElementById("close-modal-button");

  // Determine the language (e.g., from browser settings or a default)
  const language = navigator.language.split('-')[0] || 'en'; // Default to English
  languageSelector.value = language; // Set the initial value of the selector
  await initializeLanguage(language);

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

  // Add event listener for the close button
  closeModalButton.addEventListener("click", async () => {
      console.log("Close button clicked");
      await modalDisappear(welcomeModal);
  });

  // Add event listener for the language selector
  languageSelector.addEventListener("change", async (event) => {
      const selectedLanguage = event.target.value;
      await initializeLanguage(selectedLanguage);
  });

  // Set the current year in the footer
  const currentYearElm = document.getElementById("current-year");  
  if (currentYearElm) { // Check if element exists before trying to set its properties
    let currentYear = new Date().getFullYear();

    if (currentYear > 2025) {
        currentYear = `2025-${currentYear}`.toString();
    }

    currentYearElm.textContent = currentYear.toString();
  } else {
    console.error('Element with ID "current-year" not found after includes.');
  }
});