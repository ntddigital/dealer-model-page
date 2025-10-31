/**
 * Universal Accordion Manager
 * Manages multiple accordion sections with auto-rotation and media switching
 *
 * Usage:
 * 1. Include this script in your HTML: <script src="accordion-manager.js"></script>
 * 2. Follow the naming convention for HTML elements
 * 3. The script will auto-detect all accordions on the page OR
 * 4. Manually initialize with initAccordion(type, count)
 */

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

(function () {
  "use strict";

  // Matches hyphenated names like "x-line"
  const TYPE_CLASS_REGEX = /^([a-z0-9-]+)-accordion-item$/i;

  // Registries
  const accordions = Object.create(null);
  const state = Object.create(null);

  // Switch token to avoid race conditions on rapid toggles
  let switchToken = 0;

  /** Safely updates the main media for a given type/index with instant switching */
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

    if (mediaType === "video") {
      // Show video, hide image
      mainVideo.src = mediaUrl;
      mainVideo.muted = true; // improve autoplay success
      mainVideo.playsInline = true;

      mainVideo.style.display = "block";
      mainImage.style.display = "none";

      const p = mainVideo.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // Autoplay blocked — fail quietly.
        });
      }
    } else {
      // Show image, hide video
      mainImage.src = mediaUrl;

      try {
        mainVideo.pause();
      } catch (_) {}
      mainVideo.style.display = "none";
      mainImage.style.display = "block";
    }
  }

  /** Toggle a given item within a type; auto = invoked by rotation */
  function toggleAccordion(type, index, isAutomatic) {
    const items = document.querySelectorAll(`.${type}-accordion-item`);
    const clickedItem = items[index];
    if (!clickedItem || !state[type]) return;

    const content = clickedItem.querySelector(`.${type}-accordion-content`);
    const wasActive = clickedItem.classList.contains("active");

    // Manual click stops auto-rotate
    if (!isAutomatic) {
      state[type].userInteracted = true;
      clearInterval(state[type].autoRotateInterval);
    }

    // Close all
    items.forEach((it) => {
      it.classList.remove("active");
      const c = it.querySelector(`.${type}-accordion-content`);
      if (c) c.style.maxHeight = "0";

      const btn = it.querySelector(
        `.${type}-accordion-header, button, [role="button"]`
      );
      if (btn) btn.setAttribute("aria-expanded", "false");
    });

    // Open clicked (if it wasn't active)
    if (!wasActive) {
      clickedItem.classList.add("active");
      if (content) {
        // If you set CSS: transition: max-height .3s ease; overflow:hidden;
        content.style.maxHeight = content.scrollHeight + "px";
      }
      const btn = clickedItem.querySelector(
        `.${type}-accordion-header, button, [role="button"]`
      );
      if (btn) btn.setAttribute("aria-expanded", "true");

      updateMedia(type, index);
      state[type].currentIndex = index;
    }
  }

  /** Start (or restart) auto-rotation for a type; respects visibility & user interaction */
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

    // Bind once per type: pause/resume with page visibility
    if (!state[type]._visBound) {
      document.addEventListener("visibilitychange", () => {
        if (!state[type] || state[type].userInteracted) return;
        if (document.hidden) {
          clearInterval(state[type].autoRotateInterval);
        } else {
          startAutoRotate(type);
        }
      });
      state[type]._visBound = true;
    }
  }

  /** Scan DOM for *-accordion-item groups, supporting hyphenated type names */
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
        accordions[type] = {}; // keep light; lengths are read live

        // Clean old interval if any
        if (state[type] && state[type].autoRotateInterval) {
          clearInterval(state[type].autoRotateInterval);
        }

        state[type] = {
          currentIndex: 0,
          autoRotateInterval: null,
          userInteracted: false,
          _visBound: state[type]?._visBound || false,
        };

        // Expose window.toggle<Type>Accordion(index)
        const cap = type.charAt(0).toUpperCase() + type.slice(1);
        window[`toggle${cap}Accordion`] = (idx, isAutomatic = false) =>
          toggleAccordion(type, idx, isAutomatic);
      }
    });

    return detected;
  }

  /** Initialize all registered types: open first item + start rotation */
  function initializeAccordions() {
    Object.keys(accordions).forEach((type) => {
      const items = document.querySelectorAll(`.${type}-accordion-item`);
      if (items.length > 0) {
        toggleAccordion(type, 0, true);
        startAutoRotate(type);
      }
    });
  }

  // ==== Public API ====
  window.initAccordion = function (type /* count ignored; we read DOM live */) {
    // Reset if re-initializing same type
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
    // Shallow copy for safety
    return { ...accordions };
  };

  window.stopAccordionRotation = function (type) {
    if (state[type]) {
      clearInterval(state[type].autoRotateInterval);
      state[type].userInteracted = true;
    }
  };

  // ==== Boot ====
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      autoDetectAccordions();
      initializeAccordions();
    });
  } else {
    autoDetectAccordions();
    initializeAccordions();
  }
})();
