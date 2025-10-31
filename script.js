/* for kia */
// Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll(".digital-carousel-slide");
const dots = document.querySelectorAll(".digital-carousel-dot");
const track = document.getElementById("carouselTrack");

function showSlide(index) {
  // Remove active class from all dots
  dots.forEach((dot) => dot.classList.remove("active"));

  // Add active class to current dot
  if (dots[index]) {
    dots[index].classList.add("active");
  }

  // Move track to show current slide
  const translateX = -index * 100;
  track.style.transform = `translateX(${translateX}%)`;
}

function moveCarousel(direction) {
  currentSlideIndex += direction;

  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = slides.length - 1;
  }

  showSlide(currentSlideIndex);
}

function currentSlide(index) {
  currentSlideIndex = index - 1;
  showSlide(currentSlideIndex);
}

// Auto-advance carousel every 5 seconds
setInterval(() => {
  moveCarousel(1);
}, 5000);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

function openLightbox(index) {
  currentGalleryIndex = index;
  const item = galleryData[index];

  lightboxImage.src = item.image;
  lightboxTitle.textContent = item.title;
  lightboxDescription.textContent = item.description;

  lightbox.style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeLightbox() {
  lightbox.style.display = "none";
  document.body.style.overflow = "auto"; // Restore scrolling
}

function navigateLightbox(direction) {
  currentGalleryIndex += direction;

  if (currentGalleryIndex >= galleryData.length) {
    currentGalleryIndex = 0;
  } else if (currentGalleryIndex < 0) {
    currentGalleryIndex = galleryData.length - 1;
  }

  const item = galleryData[currentGalleryIndex];
  lightboxImage.src = item.image;
  lightboxTitle.textContent = item.title;
  lightboxDescription.textContent = item.description;
}

// Add click events to gallery items
galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

// Lightbox controls
lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
lightboxNext.addEventListener("click", () => navigateLightbox(1));

// Close lightbox when clicking outside the content
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "block") {
    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        navigateLightbox(-1);
        break;
      case "ArrowRight":
        navigateLightbox(1);
        break;
    }
  }
});

// Safety features slider functionality
let currentSafetyIndex = 0;
const safetyFeaturesContainer = document.querySelector(
  ".digital-safety-features-container"
);
const safetyFeatures = document.getElementById("safetyFeatures");
const safetyIndicators = document.querySelectorAll(".digital-safety-indicator");
const totalSafetySlides = 5;

let isDragging = false;
let startX = 0;
let scrollLeft = 0;

// Mouse wheel scrolling
safetyFeaturesContainer.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const scrollAmount = e.deltaY > 0 ? 200 : -200;
    safetyFeaturesContainer.scrollLeft += scrollAmount;
  },
  { passive: false }
);

// Mouse drag scrolling
safetyFeaturesContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.pageX - safetyFeaturesContainer.offsetLeft;
  scrollLeft = safetyFeaturesContainer.scrollLeft;
  safetyFeaturesContainer.style.cursor = "grabbing";
});

safetyFeaturesContainer.addEventListener("mouseleave", () => {
  isDragging = false;
  safetyFeaturesContainer.style.cursor = "grab";
});

safetyFeaturesContainer.addEventListener("mouseup", () => {
  isDragging = false;
  safetyFeaturesContainer.style.cursor = "grab";
});

safetyFeaturesContainer.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - safetyFeaturesContainer.offsetLeft;
  const walk = (x - startX) * 2;
  safetyFeaturesContainer.scrollLeft = scrollLeft - walk;
});

function updateSafetySlider() {
  const containerWidth = safetyFeaturesContainer.clientWidth;
  const scrollPosition =
    (currentSafetyIndex / (totalSafetySlides - 1)) *
    (safetyFeaturesContainer.scrollWidth - containerWidth);

  safetyFeaturesContainer.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  });
}

function moveSafetySlider(direction) {
  const newIndex = currentSafetyIndex + direction;

  if (newIndex >= 0 && newIndex < totalSafetySlides) {
    currentSafetyIndex = newIndex;
    updateSafetySlider();
  }
}

// Trims slider functionality
const trimsContainer = document.querySelector(".digital-trims-container");
const trimsGrid = document.getElementById("trimsGrid");

let isTrimsDragging = false;
let trimsStartX = 0;
let trimsScrollLeft = 0;

if (trimsContainer) {
  // Mouse wheel scrolling
  trimsContainer.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const scrollAmount = e.deltaY > 0 ? 200 : -200;
      trimsContainer.scrollLeft += scrollAmount;
    },
    { passive: false }
  );

  // Mouse drag scrolling
  trimsContainer.addEventListener("mousedown", (e) => {
    isTrimsDragging = true;
    trimsStartX = e.pageX - trimsContainer.offsetLeft;
    trimsScrollLeft = trimsContainer.scrollLeft;
    trimsContainer.classList.add("grabbing");
  });

  trimsContainer.addEventListener("mouseleave", () => {
    isTrimsDragging = false;
    trimsContainer.classList.remove("grabbing");
  });

  trimsContainer.addEventListener("mouseup", () => {
    isTrimsDragging = false;
    trimsContainer.classList.remove("grabbing");
  });

  trimsContainer.addEventListener("mousemove", (e) => {
    if (!isTrimsDragging) return;
    e.preventDefault();
    const x = e.pageX - trimsContainer.offsetLeft;
    const walk = (x - trimsStartX) * 2;
    trimsContainer.scrollLeft = trimsScrollLeft - walk;
  });

  // Touch support for mobile
  trimsContainer.addEventListener("touchstart", (e) => {
    isTrimsDragging = true;
    trimsStartX = e.touches[0].pageX - trimsContainer.offsetLeft;
    trimsScrollLeft = trimsContainer.scrollLeft;
  });

  trimsContainer.addEventListener("touchmove", (e) => {
    if (!isTrimsDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - trimsContainer.offsetLeft;
    const walk = (x - trimsStartX) * 2;
    trimsContainer.scrollLeft = trimsScrollLeft - walk;
  });

  trimsContainer.addEventListener("touchend", () => {
    isTrimsDragging = false;
  });
}

function goToSafetySlide(index) {
  if (index >= 0 && index < totalSafetySlides) {
    currentSafetyIndex = index;
    updateSafetySlider();
  }
}

// Touch support for mobile
let touchStartX = 0;
let touchScrollLeft = 0;

safetyFeaturesContainer.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchScrollLeft = safetyFeaturesContainer.scrollLeft;
});

safetyFeaturesContainer.addEventListener("touchmove", (e) => {
  if (!touchStartX) return;

  const touchX = e.touches[0].clientX;
  const walk = (touchStartX - touchX) * 2;
  safetyFeaturesContainer.scrollLeft = touchScrollLeft + walk;
});

safetyFeaturesContainer.addEventListener("touchend", () => {
  touchStartX = 0;
});

// Trims navigation function
function scrollTrims(direction) {
  const trimsContainer = document.querySelector(".digital-trims-container");
  const cardWidth = 340; // Width of each trim card plus gap
  const scrollAmount = cardWidth * direction;

  trimsContainer.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });

  // Update button states
  setTimeout(() => {
    updateTrimsNavButtons();
  }, 100);
}

// Update navigation button states based on scroll position
function updateTrimsNavButtons() {
  const trimsContainer = document.querySelector(".digital-trims-container");
  const prevBtn = document.getElementById("trimsPrevBtn");
  const nextBtn = document.getElementById("trimsNextBtn");

  if (trimsContainer && prevBtn && nextBtn) {
    const isAtStart = trimsContainer.scrollLeft <= 10;
    const isAtEnd =
      trimsContainer.scrollLeft >=
      trimsContainer.scrollWidth - trimsContainer.clientWidth - 10;

    prevBtn.disabled = isAtStart;
    nextBtn.disabled = isAtEnd;
  }
}

// Safety features navigation function
function scrollSafety(direction) {
  const safetyContainer = document.querySelector(
    ".digital-safety-features-container"
  );
  const cardWidth = 570; // Width of each safety feature card plus gap
  const scrollAmount = cardWidth * direction;

  safetyContainer.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });

  // Update button states
  setTimeout(() => {
    updateSafetyNavButtons();
  }, 100);
}

// Update safety navigation button states based on scroll position
function updateSafetyNavButtons() {
  const safetyContainer = document.querySelector(
    ".digital-safety-features-container"
  );
  const prevBtn = document.getElementById("safetyPrevBtn");
  const nextBtn = document.getElementById("safetyNextBtn");

  if (safetyContainer && prevBtn && nextBtn) {
    const isAtStart = safetyContainer.scrollLeft <= 10;
    const isAtEnd =
      safetyContainer.scrollLeft >=
      safetyContainer.scrollWidth - safetyContainer.clientWidth - 10;

    prevBtn.disabled = isAtStart;
    nextBtn.disabled = isAtEnd;
  }
}

// Initialize button states when page loads
document.addEventListener("DOMContentLoaded", function () {
  updateTrimsNavButtons();
  updateSafetyNavButtons();

  // Update button states when scrolling
  const trimsContainer = document.querySelector(".digital-trims-container");
  if (trimsContainer) {
    trimsContainer.addEventListener("scroll", updateTrimsNavButtons);
  }

  const safetyContainer = document.querySelector(
    ".digital-safety-features-container"
  );
  if (safetyContainer) {
    safetyContainer.addEventListener("scroll", updateSafetyNavButtons);
  }
});

/**
 * Universal Accordion Manager (drop-in)
 * - Auto-detects any "*-accordion-item" groups (supports hyphenated types, e.g. "x-line")
 * - Auto-rotates every 5s until user interacts
 * - Switches a main image/video per type:  #<type>MainImage / #<type>MainVideo>
 * - Safe guards for missing DOM, autoplay policies, fast switching, and visibility changes
 *
 * Public APIs:
 *   initAccordion(type)                // manually register & initialize a type
 *   getAccordionConfig()               // read-only snapshot of detected types
 *   stopAccordionRotation(type)        // stop rotation & mark as user-interacted
 *
 * Minimal HTML contract:
 *   - Each item:  <div class="<type>-accordion-item" data-media="..." data-type="image|video"> ... </div>
 *   - Content:    <div class="<type>-accordion-content">...</div>
 *   - (Optional) clickable header inside item to toggle; this script also exposes window.toggle<Type>Accordion(idx)
 *   - Main media: <img id="<type>MainImage"> and <video id="<type>MainVideo" muted playsinline></video>
 */
/**
 * Universal Accordion Manager (drop-in)
 * - Auto-detects any "*-accordion-item" groups (supports hyphenated types)
 * - Auto-rotates every 5s until user interacts
 * - Switches a main image/video per type:  #<type>MainImage / #<type>MainVideo>
 */
(function () {
  "use strict";

  const TYPE_CLASS_REGEX = /^([a-z0-9-]+)-accordion-item$/i;
  const accordions = Object.create(null);
  const state = Object.create(null);
  let switchToken = 0;

  function updateMedia(type, index) {
    const items = document.querySelectorAll(`.${type}-accordion-item`);
    const item = items[index];
    if (!item) return;

    const mediaUrl = item.getAttribute("data-media");
    const mediaType = (item.getAttribute("data-type") || "image").toLowerCase();
    const mainImage = document.getElementById(`${type}MainImage`);
    const mainVideo = document.getElementById(`${type}MainVideo`);
    if (!mediaUrl || !mainImage || !mainVideo) return;

    const myToken = ++switchToken;

    mainImage.style.opacity = "0";
    mainVideo.style.opacity = "0";

    setTimeout(() => {
      if (myToken !== switchToken) return;

      if (mediaType === "video") {
        mainVideo.src = mediaUrl;
        mainVideo.muted = true;
        mainVideo.playsInline = true;
        mainVideo.style.display = "block";
        mainImage.style.display = "none";

        const p = mainVideo.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
        mainVideo.style.opacity = "1";
      } else {
        mainImage.onload = () => {
          if (myToken === switchToken) mainImage.style.opacity = "1";
        };
        mainImage.src = mediaUrl;
        if (mainImage.complete) mainImage.style.opacity = "1";
        try {
          mainVideo.pause();
        } catch (_) {}
        mainVideo.style.display = "none";
        mainImage.style.display = "block";
      }
    }, 120);
  }

  function toggleAccordion(type, index, isAutomatic) {
    const items = document.querySelectorAll(`.${type}-accordion-item`);
    const clickedItem = items[index];
    if (!clickedItem || !state[type]) return;

    const content = clickedItem.querySelector(`.${type}-accordion-content`);
    const wasActive = clickedItem.classList.contains("active");

    if (!isAutomatic) {
      state[type].userInteracted = true;
      clearInterval(state[type].autoRotateInterval);
    }

    items.forEach((it) => {
      it.classList.remove("active");
      const c = it.querySelector(`.${type}-accordion-content`);
      if (c) c.style.maxHeight = "0";
      const btn = it.querySelector(
        `.${type}-accordion-header, button, [role="button"]`
      );
      if (btn) btn.setAttribute("aria-expanded", "false");
    });

    if (!wasActive) {
      clickedItem.classList.add("active");
      if (content) content.style.maxHeight = content.scrollHeight + "px";
      const btn = clickedItem.querySelector(
        `.${type}-accordion-header, button, [role="button"]`
      );
      if (btn) btn.setAttribute("aria-expanded", "true");

      updateMedia(type, index);
      state[type].currentIndex = index;
    }
  }

  function startAutoRotate(type) {
    if (!state[type] || state[type].userInteracted) return;

    const tick = () => {
      if (state[type].userInteracted || document.hidden) return;
      const items = document.querySelectorAll(`.${type}-accordion-item`);
      const len = items.length || 0;
      if (!len) return;
      state[type].currentIndex = (state[type].currentIndex + 1) % len;
      toggleAccordion(type, state[type].currentIndex, true);
    };

    clearInterval(state[type].autoRotateInterval);
    state[type].autoRotateInterval = setInterval(tick, 5000);

    if (!state[type]._visBound) {
      document.addEventListener("visibilitychange", () => {
        if (!state[type] || state[type].userInteracted) return;
        if (document.hidden) clearInterval(state[type].autoRotateInterval);
        else startAutoRotate(type);
      });
      state[type]._visBound = true;
    }
  }

  function autoDetectAccordions() {
    const detected = new Set();
    const all = document.querySelectorAll('[class*="-accordion-item"]');

    all.forEach((el) => {
      el.className.split(/\s+/).forEach((cls) => {
        const m = cls.match(TYPE_CLASS_REGEX);
        if (m) detected.add(m[1]);
      });
    });

    detected.forEach((type) => {
      if (!accordions[type]) {
        accordions[type] = {};
        if (state[type] && state[type].autoRotateInterval) {
          clearInterval(state[type].autoRotateInterval);
        }
        state[type] = {
          currentIndex: 0,
          autoRotateInterval: null,
          userInteracted: false,
          _visBound: state[type]?._visBound || false,
        };

        const cap = type.charAt(0).toUpperCase() + type.slice(1);
        window[`toggle${cap}Accordion`] = (idx, isAutomatic = false) =>
          toggleAccordion(type, idx, isAutomatic);
      }
    });

    return detected;
  }

  function initializeAccordions() {
    Object.keys(accordions).forEach((type) => {
      const items = document.querySelectorAll(`.${type}-accordion-item`);
      if (items.length > 0) {
        toggleAccordion(type, 0, true);
        startAutoRotate(type);
      }
    });
  }

  window.initAccordion = function (type) {
    if (state[type] && state[type].autoRotateInterval) {
      clearInterval(state[type].autoRotateInterval);
    }
    accordions[type] = {};
    state[type] = {
      currentIndex: 0,
      autoRotateInterval: null,
      userInteracted: false,
      _visBound: state[type]?._visBound || false,
    };

    const cap = type.charAt(0).toUpperCase() + type.slice(1);
    window[`toggle${cap}Accordion`] = (idx, isAutomatic = false) =>
      toggleAccordion(type, idx, isAutomatic);

    const items = document.querySelectorAll(`.${type}-accordion-item`);
    if (items.length > 0) {
      toggleAccordion(type, 0, true);
      startAutoRotate(type);
    }
  };

  window.getAccordionConfig = function () {
    return { ...accordions };
  };

  window.stopAccordionRotation = function (type) {
    if (state[type]) {
      clearInterval(state[type].autoRotateInterval);
      state[type].userInteracted = true;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      autoDetectAccordions();
      initializeAccordions();
      // console.info('[Accordion] init types:', Object.keys(accordions));
    });
  } else {
    autoDetectAccordions();
    initializeAccordions();
    // console.info('[Accordion] init types:', Object.keys(accordions));
  }
})();
