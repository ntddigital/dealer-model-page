// Carousel functionality
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.digital-carousel-slide');
    const dots = document.querySelectorAll('.digital-carousel-dot');
    const track = document.getElementById('carouselTrack');

    function showSlide(index) {
        // Remove active class from all dots
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current dot
        if (dots[index]) {
            dots[index].classList.add('active');
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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });



    function openLightbox(index) {
        currentGalleryIndex = index;
        const item = galleryData[index];

        lightboxImage.src = item.image;
        lightboxTitle.textContent = item.title;
        lightboxDescription.textContent = item.description;

        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
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
        item.addEventListener('click', () => openLightbox(index));
    });

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    navigateLightbox(1);
                    break;
            }
        }
    });

    // Safety features slider functionality
    let currentSafetyIndex = 0;
    const safetyFeaturesContainer = document.querySelector('.digital-safety-features-container');
    const safetyFeatures = document.getElementById('safetyFeatures');
    const safetyIndicators = document.querySelectorAll('.digital-safety-indicator');
    const totalSafetySlides = 5;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // Mouse wheel scrolling
    safetyFeaturesContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const scrollAmount = e.deltaY > 0 ? 200 : -200;
        safetyFeaturesContainer.scrollLeft += scrollAmount;
    }, { passive: false });

    // Mouse drag scrolling
    safetyFeaturesContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - safetyFeaturesContainer.offsetLeft;
        scrollLeft = safetyFeaturesContainer.scrollLeft;
        safetyFeaturesContainer.style.cursor = 'grabbing';
    });

    safetyFeaturesContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        safetyFeaturesContainer.style.cursor = 'grab';
    });

    safetyFeaturesContainer.addEventListener('mouseup', () => {
        isDragging = false;
        safetyFeaturesContainer.style.cursor = 'grab';
    });

    safetyFeaturesContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - safetyFeaturesContainer.offsetLeft;
        const walk = (x - startX) * 2;
        safetyFeaturesContainer.scrollLeft = scrollLeft - walk;
    });

    function updateSafetySlider() {
        const containerWidth = safetyFeaturesContainer.clientWidth;
        const scrollPosition = (currentSafetyIndex / (totalSafetySlides - 1)) * (safetyFeaturesContainer.scrollWidth - containerWidth);

        safetyFeaturesContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
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
    const trimsContainer = document.querySelector('.digital-trims-container');
    const trimsGrid = document.getElementById('trimsGrid');

    let isTrimsD窶脚agging = false;
    let trimsStartX = 0;
    let trimsScrollLeft = 0;

    if (trimsContainer) {
        // Mouse wheel scrolling
        trimsContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const scrollAmount = e.deltaY > 0 ? 200 : -200;
            trimsContainer.scrollLeft += scrollAmount;
        }, { passive: false });

        // Mouse drag scrolling
        trimsContainer.addEventListener('mousedown', (e) => {
            isTrimsD窶脚agging = true;
            trimsStartX = e.pageX - trimsContainer.offsetLeft;
            trimsScrollLeft = trimsContainer.scrollLeft;
            trimsContainer.classList.add('grabbing');
        });

        trimsContainer.addEventListener('mouseleave', () => {
            isTrimsD窶脚agging = false;
            trimsContainer.classList.remove('grabbing');
        });

        trimsContainer.addEventListener('mouseup', () => {
            isTrimsD窶脚agging = false;
            trimsContainer.classList.remove('grabbing');
        });

        trimsContainer.addEventListener('mousemove', (e) => {
            if (!isTrimsD窶脚agging) return;
            e.preventDefault();
            const x = e.pageX - trimsContainer.offsetLeft;
            const walk = (x - trimsStartX) * 2;
            trimsContainer.scrollLeft = trimsScrollLeft - walk;
        });

        // Touch support for mobile
        trimsContainer.addEventListener('touchstart', (e) => {
            isTrimsD窶脚agging = true;
            trimsStartX = e.touches[0].pageX - trimsContainer.offsetLeft;
            trimsScrollLeft = trimsContainer.scrollLeft;
        });

        trimsContainer.addEventListener('touchmove', (e) => {
            if (!isTrimsD窶脚agging) return;
            e.preventDefault();
            const x = e.touches[0].pageX - trimsContainer.offsetLeft;
            const walk = (x - trimsStartX) * 2;
            trimsContainer.scrollLeft = trimsScrollLeft - walk;
        });

        trimsContainer.addEventListener('touchend', () => {
            isTrimsD窶脚agging = false;
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

    safetyFeaturesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchScrollLeft = safetyFeaturesContainer.scrollLeft;
    });

    safetyFeaturesContainer.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;

        const touchX = e.touches[0].clientX;
        const walk = (touchStartX - touchX) * 2;
        safetyFeaturesContainer.scrollLeft = touchScrollLeft + walk;
    });

    safetyFeaturesContainer.addEventListener('touchend', () => {
        touchStartX = 0;
    });

    // Trims navigation function
    function scrollTrims(direction) {
        const trimsContainer = document.querySelector('.digital-trims-container');
        const cardWidth = 340; // Width of each trim card plus gap
        const scrollAmount = cardWidth * direction;
        
        trimsContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        // Update button states
        setTimeout(() => {
            updateTrimsNavButtons();
        }, 100);
    }

    // Update navigation button states based on scroll position
    function updateTrimsNavButtons() {
        const trimsContainer = document.querySelector('.digital-trims-container');
        const prevBtn = document.getElementById('trimsPrevBtn');
        const nextBtn = document.getElementById('trimsNextBtn');
        
        if (trimsContainer && prevBtn && nextBtn) {
            const isAtStart = trimsContainer.scrollLeft <= 10;
            const isAtEnd = trimsContainer.scrollLeft >= (trimsContainer.scrollWidth - trimsContainer.clientWidth - 10);
            
            prevBtn.disabled = isAtStart;
            nextBtn.disabled = isAtEnd;
        }
    }

    // Safety features navigation function
    function scrollSafety(direction) {
        const safetyContainer = document.querySelector('.digital-safety-features-container');
        const cardWidth = 570; // Width of each safety feature card plus gap
        const scrollAmount = cardWidth * direction;
        
        safetyContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        // Update button states
        setTimeout(() => {
            updateSafetyNavButtons();
        }, 100);
    }

    // Update safety navigation button states based on scroll position
    function updateSafetyNavButtons() {
        const safetyContainer = document.querySelector('.digital-safety-features-container');
        const prevBtn = document.getElementById('safetyPrevBtn');
        const nextBtn = document.getElementById('safetyNextBtn');
        
        if (safetyContainer && prevBtn && nextBtn) {
            const isAtStart = safetyContainer.scrollLeft <= 10;
            const isAtEnd = safetyContainer.scrollLeft >= (safetyContainer.scrollWidth - safetyContainer.clientWidth - 10);
            
            prevBtn.disabled = isAtStart;
            nextBtn.disabled = isAtEnd;
        }
    }

    // Initialize button states when page loads
    document.addEventListener('DOMContentLoaded', function() {
        updateTrimsNavButtons();
        updateSafetyNavButtons();
        
        // Update button states when scrolling
        const trimsContainer = document.querySelector('.digital-trims-container');
        if (trimsContainer) {
            trimsContainer.addEventListener('scroll', updateTrimsNavButtons);
        }
        
        const safetyContainer = document.querySelector('.digital-safety-features-container');
        if (safetyContainer) {
            safetyContainer.addEventListener('scroll', updateSafetyNavButtons);
        }
    });