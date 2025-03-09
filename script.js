document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".content");

  // Set the first section and tab as active by default
  contents[0].classList.add("active");
  tabs[0].classList.add("active");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");

      // Only proceed if the clicked tab is not already active
      if (!this.classList.contains("active")) {
        // Remove active class from all tabs and contents
        tabs.forEach((tab) => tab.classList.remove("active"));
        contents.forEach((content) => content.classList.remove("active"));

        // Add active class to the clicked tab and corresponding content
        this.classList.add("active");
        document.getElementById(targetId).classList.add("active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const imgElements = document.querySelectorAll("img.button-img");
  const themeCyclerButton = document.getElementById("theme-cycler");

  // Theme configurations
  const themes = [
    {
      bgColor: "rgb(242, 242, 242)",
      textColor: "rgb(24, 24, 24)",
      filter: "brightness(0) invert(22%)", // Grayscale
    },
    {
      bgColor: "rgb(5, 5, 5)",
      textColor: "rgb(245, 222, 179)",
      filter:
        "brightness(0) saturate(100%) invert(93%) sepia(96%) saturate(365%) hue-rotate(313deg) brightness(99%) contrast(94%)",
    },
    {
      bgColor: "rgb(231, 40, 40)",
      textColor: "rgb(32, 32, 32)",
      filter: "brightness(0) invert(12%)",
    },
    {
      bgColor: "rgb(7, 7, 7)",
      textColor: "rgb(248, 248, 248)",
      filter: "brightness(0) invert(95%)", // Dark and high contrast
    },

    {
      bgColor: "rgb(48, 48, 48)",
      textColor: "rgb(200, 200, 200)",
      filter: "brightness(0) invert(70%)",
    },
  ];

  let currentThemeIndex = 0; // Get saved theme index or default to 0
  // parseInt(localStorage.getItem("themeIndex")) ||
  // Function to apply the theme
  function applyTheme(theme) {
    document.body.style.backgroundColor = theme.bgColor;

    const textElements = document.querySelectorAll("h1, h2, h3, p");
    textElements.forEach((element) => {
      element.style.color = theme.textColor;
    });
    imgElements.forEach((element) => {
      element.style.filter = theme.filter;
    });
  }

  // Function to cycle through themes
  function cycleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length; // Increment index and loop back to 0
    localStorage.setItem("themeIndex", currentThemeIndex); // Save the selected theme index
    applyTheme(themes[currentThemeIndex]);
  }

  // Apply the saved or default theme on page load
  applyTheme(themes[currentThemeIndex]);

  // Add event listener to the button
  themeCyclerButton.addEventListener("click", cycleTheme);
});

document.addEventListener("DOMContentLoaded", function () {
  const thumbnails = document.querySelectorAll(".thumbnail img");
  const modal = document.getElementById("dynamic-modal");
  const modalBody = modal.querySelector(".modal-body");
  const closeButton = modal.querySelector(".close");

  // Carousel configuration
  const carouselConfig = {
    uno: {
      center: true,
    },
    dos: {
      center: false,
    },
    carousel_config_three: {
      center: false,
      slideBy: 4,
      items: 4,
    },
    // Add more configurations as needed
  };

  // Add click event to thumbnails
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      const contentSrc = this.getAttribute("data-src");

      // Load content dynamically
      fetch(contentSrc)
        .then((response) => response.text())
        .then((data) => {
          modalBody.innerHTML = data;
          modal.style.display = "block";

          // Lazy-load images after content is inserted
          const lazyImages = modalBody.querySelectorAll("img.lazy-load");
          lazyImages.forEach((img) => {
            img.src = img.getAttribute("data-src"); // Load the image
          });

          // Initialize Owl Carousels after content is loaded
          modalBody.querySelectorAll(".owl-carousel").forEach((carousel) => {
            const carouselId = carousel.id;
            const config = carouselConfig[carouselId] || {}; // Get config for this carousel

            $(carousel).owlCarousel({
              loop: true,
              margin: 10,
              dots: false,
              nav: true,
              navText: [
                '<img src="./icon/arrow.svg" alt="left">',
                '<img src="./icon/arrow.svg" alt="right">',
              ],
              responsive: {
                0: {
                  items: 1,
                },
                600: {
                  items: 2,
                },
                1000: {
                  items: config.items, // Use config value or default
                },
              },
              center: config.center, // Use config value or default
              slideBy: config.slideBy,
              autoWidth: true,
              lazyLoad: true,
              lazyLoadEager: 1,
              margin: 10,
            });
          });
        })
        .catch((error) => {
          console.error("Error loading modal content:", error);
          modalBody.innerHTML = "<p>Error loading content.</p>";
          modal.style.display = "block";
        });
    });
  });

  // Add click event to close button
  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

let owlInstance = null; // Store the Owl Carousel instance

// Initialize Owl Carousel
function initializeCarousel() {
  if (!owlInstance) {
    // Ensure the container has the correct Owl Carousel classes
    const imageContainer = document.getElementById("image-container");
    imageContainer.classList.add("owl-carousel", "owl-theme");

    const nextIcon = '<img src="./icon/arrow.svg" alt="right">';
    const prevIcon = '<img src="./icon/arrow.svg" alt="left" >';
    // Initialize Owl Carousel
    owlInstance = $(imageContainer).owlCarousel({
      loop: true,
      nav: true,
      dots: true,
      lazyLoad: true,
      responsive: {
        0: {
          items: 1,
          dots: false,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 5,
        },
      },
      autoWidth: true,
      navText: [prevIcon, nextIcon],
      center: false,
      // stagePadding: 120,
      // autoplay: true,
      autoplayTimeout: 4500,
      autoplayHoverPause: false,
      margin: 10,
    });
  }
}

// Destroy Owl Carousel
function destroyCarousel() {
  if (owlInstance) {
    owlInstance.trigger("destroy.owl.carousel"); // Destroy the carousel instance
    owlInstance = null; // Reset the instance variable

    // Remove Owl Carousel classes
    const imageContainer = document.getElementById("image-container");
    imageContainer.classList.remove("owl-carousel", "owl-theme");
  }
}

// Switch Layout Function
function switchLayout(layout) {
  const imageContainer = document.getElementById("image-container");
  const gridButton = document.getElementById("grid-button");
  const carouselButton = document.getElementById("carousel-button");

  if (layout === "grid") {
    // Switch to Grid Layout
    destroyCarousel(); // Destroy the carousel instance
    imageContainer.classList.remove("carousel");
    imageContainer.classList.add("grid");
    gridButton.classList.add("active");
    carouselButton.classList.remove("active");
  } else if (layout === "carousel") {
    // Switch to Carousel Layout
    imageContainer.classList.remove("grid");
    imageContainer.classList.add("carousel");
    carouselButton.classList.add("active");
    gridButton.classList.remove("active");
    initializeCarousel(); // Initialize Owl Carousel
  }
}

// Event Listeners for Buttons
document
  .getElementById("grid-button")
  .addEventListener("click", () => switchLayout("grid"));
document
  .getElementById("carousel-button")
  .addEventListener("click", () => switchLayout("carousel"));

// Default to Grid Layout
switchLayout("grid");
