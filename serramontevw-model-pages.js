// VW Showroom - Universal JavaScript for all model pages
// Page-specific configuration should be defined in HTML via data attributes

(() => {
  "use strict";

  // Utility functions
  function safeImageSwap(imgEl, newSrc, duration = 150) {
    if (!imgEl) return;
    imgEl.style.opacity = "0";
    setTimeout(() => {
      imgEl.src = newSrc;
      imgEl.style.opacity = "1";
    }, duration);
  }

  function toggleActive(elements, activeIndex) {
    elements.forEach((el, i) =>
      el.classList.toggle("active", i === activeIndex)
    );
  }

  function scrollContainer(containerId, direction, amount) {
    const scroller = document.getElementById(containerId);
    if (!scroller) return;
    scroller.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  // Load configuration from HTML data attributes
  function loadConfig() {
    const configEl = document.getElementById("vw-page-config");
    if (!configEl) {
      console.warn("Configuration element #vw-page-config not found in HTML.");
      return null;
    }

    try {
      return {
        scrollAmounts: {
          trims: parseInt(configEl.dataset.scrollTrims) || 452,
          benefits: parseInt(configEl.dataset.scrollBenefits) || 524,
        },
        galleryImages: JSON.parse(configEl.dataset.galleryImages || "[]"),
        rtrAccordion: JSON.parse(configEl.dataset.rtrAccordion || "[]"),
        techAccordion: JSON.parse(configEl.dataset.techAccordion || "[]"),
        designAccordion: JSON.parse(configEl.dataset.designAccordion || "[]"),
        safetyAccordion: JSON.parse(configEl.dataset.safetyAccordion || "[]"),
      };
    } catch (e) {
      console.error("Error parsing configuration data:", e);
      return null;
    }
  }

  // Initialize when DOM is ready
  function init() {
    const config = loadConfig();
    if (!config) {
      return;
    }

    // State variables
    let currentGalleryIndex = 0;
    let currentRtrAccordionIndex = 0;
    let currentRtrImageIndex = 0;
    let currentTechAccordionIndex = 0;
    let currentTechImageIndex = 0;
    let currentDesignAccordionIndex = 0;
    let currentDesignImageIndex = 0;
    let currentSafetyAccordionIndex = 0;
    let currentSafetyImageIndex = 0;

    // Public API
    const hbford = {
      // Scroll functions
      scrollTrims: (dir) =>
        scrollContainer(
          "trimsScroller",
          dir,
          config.scrollAmounts?.trims || 452
        ),
      scrollBenefits: (dir) =>
        scrollContainer(
          "benefitsScroller",
          dir,
          config.scrollAmounts?.benefits || 524
        ),

      // Gallery functions
      changeImage(index, imageUrl) {
        currentGalleryIndex = index;
        const mainImage = document.getElementById("mainImage");
        if (!mainImage) return;
        safeImageSwap(mainImage, imageUrl);
        toggleActive(
          document.querySelectorAll(".serramontevw-gallery-thumbnail"),
          index
        );
      },

      prevImage() {
        const images = config.galleryImages || [];
        currentGalleryIndex =
          (currentGalleryIndex - 1 + images.length) % images.length;
        this.changeImage(currentGalleryIndex, images[currentGalleryIndex]);
      },

      nextImage() {
        const images = config.galleryImages || [];
        currentGalleryIndex = (currentGalleryIndex + 1) % images.length;
        this.changeImage(currentGalleryIndex, images[currentGalleryIndex]);
      },

      // RTR Accordion (Technology features)
      toggleAccordion(index) {
        const rtrSection = document.querySelector(".serramontevw-rtr-section");
        if (!rtrSection) return;
        const items = rtrSection.querySelectorAll(
          ".serramontevw-accordion-item"
        );
        const rtrImage = document.getElementById("rtrImage");
        const accordionImageSets = config.rtrAccordion || [];

        if (!rtrImage) return;

        items.forEach((item, i) => {
          if (i === index) {
            item.classList.toggle("active");
            if (item.classList.contains("active")) {
              currentRtrAccordionIndex = index;
              currentRtrImageIndex = 0;
              safeImageSwap(rtrImage, accordionImageSets[index][0]);
              this.updateRtrNavButtons();
            }
          } else {
            item.classList.remove("active");
          }
        });
      },

      prevRtrImage() {
        const accordionImageSets = config.rtrAccordion || [];
        const currentImages = accordionImageSets[currentRtrAccordionIndex];
        if (currentRtrImageIndex > 0) {
          currentRtrImageIndex--;
          const rtrImage = document.getElementById("rtrImage");
          if (rtrImage) {
            safeImageSwap(rtrImage, currentImages[currentRtrImageIndex]);
          }
          this.updateRtrNavButtons();
        }
      },

      nextRtrImage() {
        const accordionImageSets = config.rtrAccordion || [];
        const currentImages = accordionImageSets[currentRtrAccordionIndex];
        if (currentRtrImageIndex < currentImages.length - 1) {
          currentRtrImageIndex++;
          const rtrImage = document.getElementById("rtrImage");
          if (rtrImage) {
            safeImageSwap(rtrImage, currentImages[currentRtrImageIndex]);
          }
          this.updateRtrNavButtons();
        }
      },

      updateRtrNavButtons() {
        const accordionImageSets = config.rtrAccordion || [];
        const rtrNav = document.querySelector(".serramontevw-rtr-nav");
        const prevBtn = document.getElementById("rtrPrevBtn");
        const nextBtn = document.getElementById("rtrNextBtn");
        const currentImages = accordionImageSets[currentRtrAccordionIndex];

        if (rtrNav) {
          rtrNav.style.display = currentImages.length <= 1 ? "none" : "flex";
        }
        if (prevBtn) {
          prevBtn.disabled = currentRtrImageIndex === 0;
        }
        if (nextBtn) {
          nextBtn.disabled = currentRtrImageIndex === currentImages.length - 1;
        }
      },

      // Tech Accordion (Driver Assistance)
      toggleTechAccordion(index) {
        const techSection = document.querySelector(
          ".serramontevw-technology-section"
        );
        if (!techSection) return;
        const items = techSection.querySelectorAll(
          ".serramontevw-accordion-item"
        );
        const accordionMediaSets = config.techAccordion || [];

        items.forEach((item, i) => {
          if (i === index) {
            item.classList.toggle("active");
            if (item.classList.contains("active")) {
              currentTechAccordionIndex = index;
              currentTechImageIndex = 0;
              this.swapTechMedia(accordionMediaSets[index][0]);
              this.updateTechNavButtons();
            }
          } else {
            item.classList.remove("active");
          }
        });
      },

      swapTechMedia(media) {
        const techVideo = document.getElementById("techImage");
        const techImage = document.getElementById("techImageStatic");

        if (!techVideo || !techImage) return;

        if (media.type === "video") {
          techVideo.style.display = "block";
          techImage.style.display = "none";
          techVideo.style.opacity = "0";
          setTimeout(() => {
            const source = techVideo.querySelector("source");
            if (source) {
              source.src = media.src;
            }
            techVideo.load();
            techVideo.play();
            techVideo.style.opacity = "1";
          }, 150);
        } else {
          techVideo.style.display = "none";
          techImage.style.display = "block";
          techImage.style.opacity = "0";
          setTimeout(() => {
            techImage.src = media.src;
            techImage.style.opacity = "1";
          }, 150);
        }
      },

      prevTechImage() {
        const accordionMediaSets = config.techAccordion || [];
        const currentMedia = accordionMediaSets[currentTechAccordionIndex];
        if (currentTechImageIndex > 0) {
          currentTechImageIndex--;
          this.swapTechMedia(currentMedia[currentTechImageIndex]);
          this.updateTechNavButtons();
        }
      },

      nextTechImage() {
        const accordionMediaSets = config.techAccordion || [];
        const currentMedia = accordionMediaSets[currentTechAccordionIndex];
        if (currentTechImageIndex < currentMedia.length - 1) {
          currentTechImageIndex++;
          this.swapTechMedia(currentMedia[currentTechImageIndex]);
          this.updateTechNavButtons();
        }
      },

      updateTechNavButtons() {
        const accordionMediaSets = config.techAccordion || [];
        const techNav = document.getElementById("techNav");
        const prevBtn = document.getElementById("techPrevBtn");
        const nextBtn = document.getElementById("techNextBtn");
        const currentMedia = accordionMediaSets[currentTechAccordionIndex];

        if (techNav) {
          techNav.style.display = currentMedia.length <= 1 ? "none" : "flex";
        }
        if (prevBtn) {
          prevBtn.disabled = currentTechImageIndex === 0;
        }
        if (nextBtn) {
          nextBtn.disabled = currentTechImageIndex === currentMedia.length - 1;
        }
      },

      // Design Accordion
      toggleDesignAccordion(index) {
        const allTechSections = document.querySelectorAll(
          ".serramontevw-technology-section"
        );
        const designSection = allTechSections[allTechSections.length - 2];
        if (!designSection) return;
        const items = designSection.querySelectorAll(
          ".serramontevw-accordion-item"
        );
        const accordionMediaSets = config.designAccordion || [];

        items.forEach((item, i) => {
          if (i === index) {
            item.classList.toggle("active");
            if (item.classList.contains("active")) {
              currentDesignAccordionIndex = index;
              currentDesignImageIndex = 0;
              this.swapDesignMedia(accordionMediaSets[index][0]);
              this.updateDesignNavButtons();
            }
          } else {
            item.classList.remove("active");
          }
        });
      },

      swapDesignMedia(media) {
        const designImage = document.getElementById("designImage");
        const designVideo = document.getElementById("designVideo");

        if (!designImage || !designVideo) return;

        if (media.type === "video") {
          designImage.style.display = "none";
          designVideo.style.display = "block";
          designVideo.style.opacity = "0";
          setTimeout(() => {
            const source = designVideo.querySelector("source");
            if (source) {
              source.src = media.src;
            }
            designVideo.load();
            designVideo.play();
            designVideo.style.opacity = "1";
          }, 150);
        } else {
          designVideo.style.display = "none";
          designImage.style.display = "block";
          designImage.style.opacity = "0";
          setTimeout(() => {
            designImage.src = media.src;
            designImage.style.opacity = "1";
          }, 150);
        }
      },

      prevDesignImage() {
        const accordionMediaSets = config.designAccordion || [];
        const currentMedia = accordionMediaSets[currentDesignAccordionIndex];
        if (currentDesignImageIndex > 0) {
          currentDesignImageIndex--;
          this.swapDesignMedia(currentMedia[currentDesignImageIndex]);
          this.updateDesignNavButtons();
        }
      },

      nextDesignImage() {
        const accordionMediaSets = config.designAccordion || [];
        const currentMedia = accordionMediaSets[currentDesignAccordionIndex];
        if (currentDesignImageIndex < currentMedia.length - 1) {
          currentDesignImageIndex++;
          this.swapDesignMedia(currentMedia[currentDesignImageIndex]);
          this.updateDesignNavButtons();
        }
      },

      updateDesignNavButtons() {
        const accordionMediaSets = config.designAccordion || [];
        const designNav = document.getElementById("designNav");
        const prevBtn = document.getElementById("designPrevBtn");
        const nextBtn = document.getElementById("designNextBtn");
        const currentMedia = accordionMediaSets[currentDesignAccordionIndex];

        if (designNav) {
          designNav.style.display = currentMedia.length <= 1 ? "none" : "flex";
        }
        if (prevBtn) {
          prevBtn.disabled = currentDesignImageIndex === 0;
        }
        if (nextBtn) {
          nextBtn.disabled =
            currentDesignImageIndex === currentMedia.length - 1;
        }
      },

      // Safety Accordion
      toggleSafetyAccordion(index) {
        const allTechSections = document.querySelectorAll(
          ".serramontevw-technology-section"
        );
        const safetySection = allTechSections[allTechSections.length - 1];
        if (!safetySection) return;
        const items = safetySection.querySelectorAll(
          ".serramontevw-accordion-item"
        );
        const accordionImages = config.safetyAccordion || [];

        items.forEach((item, i) => {
          if (i === index) {
            item.classList.toggle("active");
            if (item.classList.contains("active")) {
              currentSafetyAccordionIndex = index;
              currentSafetyImageIndex = 0;
              this.swapSafetyImage(accordionImages[index]);
              this.updateSafetyNavButtons();
            }
          } else {
            item.classList.remove("active");
          }
        });
      },

      swapSafetyImage(imageSrc) {
        const safetyImage = document.getElementById("safetyImage");
        if (!safetyImage) return;
        safetyImage.style.opacity = "0";
        setTimeout(() => {
          safetyImage.src = imageSrc;
          safetyImage.style.opacity = "1";
        }, 150);
      },

      prevSafetyImage() {
        // Placeholder for consistency
      },

      nextSafetyImage() {
        // Placeholder for consistency
      },

      updateSafetyNavButtons() {
        const safetyNav = document.getElementById("safetyNav");
        if (safetyNav) {
          safetyNav.style.display = "none";
        }
      },
    };

    // Expose to global scope
    window.hbford = hbford;
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
