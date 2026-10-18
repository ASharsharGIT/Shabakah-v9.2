/* =====================================================
   PROJECTS CAROUSEL - AUTO-SLIDING JAVASCRIPT
   Smooth, reliable, no scroll-jacking
   ===================================================== */

(function() {
    'use strict';
    
    function initProjectsCarousel() {
        const carousel = document.querySelector('.projects-carousel');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.dot');
        const prevBtn = carousel.querySelector('.nav-prev');
        const nextBtn = carousel.querySelector('.nav-next');
        const progressBar = carousel.querySelector('.progress-bar');
        const slidesContainer = carousel.querySelector('.carousel-slides');
        
        if (slides.length === 0) return;

        if (slidesContainer) {
            slidesContainer.setAttribute('aria-live', 'polite');
            slidesContainer.setAttribute('aria-atomic', 'true');
        }

        let resizeTimer = null;
        let currentIndex = 0;
        let autoPlayTimer = null;
        let progressInterval = null;
        let isInView = true;
        const autoPlayDelay = 5000;
        const progressStep = 50;

        function syncCarouselHeight() {
            if (!slidesContainer) return;
            const active = slidesContainer.querySelector('.carousel-slide.active');
            if (!active) return;
            slidesContainer.style.height = active.scrollHeight + 'px';
        }

        function scheduleHeightSync() {
            requestAnimationFrame(() => {
                syncCarouselHeight();
                requestAnimationFrame(syncCarouselHeight);
            });
        }

        function restartDotAnimation(dot) {
            const span = dot.querySelector('span');
            if (!span) return;
            span.style.animation = 'none';
            void span.offsetWidth;
            span.style.animation = '';
        }

        function updateDots(index) {
            dots.forEach((dot, i) => {
                const isActive = i === index;
                dot.classList.toggle('active', isActive);
                if (isActive) {
                    restartDotAnimation(dot);
                }
            });
        }
        
        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'prev');
                if (i === index) {
                    slide.classList.add('active');
                } else if (i < index || (index === 0 && i === slides.length - 1)) {
                    slide.classList.add('prev');
                }
            });
            
            updateDots(index);
            currentIndex = index;
            resetProgress();
            scheduleHeightSync();
        }
        
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        function resetProgress() {
            if (progressInterval) clearInterval(progressInterval);
            if (!progressBar) return;
            
            let progress = 0;
            progressBar.style.width = '0%';
            
            progressInterval = setInterval(() => {
                progress += (progressStep / autoPlayDelay) * 100;
                progressBar.style.width = Math.min(progress, 100) + '%';
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    progressInterval = null;
                }
            }, progressStep);
        }
        
        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearTimeout(autoPlayTimer);
                autoPlayTimer = null;
            }
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
            carousel.classList.remove('is-autoplaying');
        }
        
        function startAutoPlay() {
            stopAutoPlay();
            if (!isInView) return;

            carousel.classList.add('is-autoplaying');
            resetProgress();

            autoPlayTimer = setTimeout(function tick() {
                nextSlide();
                if (!isInView) return;
                resetProgress();
                autoPlayTimer = setTimeout(tick, autoPlayDelay);
            }, autoPlayDelay);
        }

        function onManualNav(callback) {
            callback();
            startAutoPlay();
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => onManualNav(prevSlide));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => onManualNav(nextSlide));
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => onManualNav(() => goToSlide(index)));
        });
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    onManualNav(nextSlide);
                } else {
                    onManualNav(prevSlide);
                }
            }
        }, { passive: true });
        
        document.addEventListener('keydown', (e) => {
            const rect = carousel.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (!inView) return;
            
            if (e.key === 'ArrowLeft') {
                onManualNav(prevSlide);
            } else if (e.key === 'ArrowRight') {
                onManualNav(nextSlide);
            }
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        });

        const viewObserver = new IntersectionObserver((entries) => {
            isInView = entries[0].isIntersecting;
            if (isInView) {
                startAutoPlay();
            } else {
                stopAutoPlay();
            }
        }, { threshold: 0.25 });

        viewObserver.observe(carousel);
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(scheduleHeightSync, 150);
        });

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(scheduleHeightSync);
        }

        carousel.querySelectorAll('img, video').forEach((media) => {
            if (media.tagName === 'IMG' && !media.complete) {
                media.addEventListener('load', scheduleHeightSync, { once: true });
            }
            if (media.tagName === 'VIDEO') {
                media.addEventListener('loadedmetadata', scheduleHeightSync, { once: true });
            }
        });

        goToSlide(0);
        startAutoPlay();
        scheduleHeightSync();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectsCarousel);
    } else {
        initProjectsCarousel();
    }
})();
