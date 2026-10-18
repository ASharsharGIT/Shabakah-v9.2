/**
 * Homepage media: video lifecycle, reduced-motion posters, carousel sync
 */
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function applyReducedMotionVideos() {
        if (!prefersReducedMotion.matches) return;

        document.querySelectorAll('.home-video').forEach(video => {
            video.pause();
            video.removeAttribute('autoplay');
            video.style.display = 'none';
            const poster = video.closest('.slide-media, .proof-media-panel');
            const fallback = poster && poster.querySelector('.home-video__poster');
            if (fallback) {
                fallback.hidden = false;
            }
        });
    }

    function pauseOffScreenVideos() {
        if (prefersReducedMotion.matches) return;

        const videos = document.querySelectorAll('.home-video');
        if (!videos.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.25 });

        videos.forEach(video => observer.observe(video));
    }

    function initCarouselVideos() {
        const carousel = document.querySelector('.projects-carousel');
        if (!carousel || prefersReducedMotion.matches) return;

        const slides = carousel.querySelectorAll('.carousel-slide');

        function syncSlideVideos() {
            slides.forEach(slide => {
                const video = slide.querySelector('.home-video');
                if (!video) return;
                if (slide.classList.contains('active')) {
                    video.preload = 'auto';
                    video.play().catch(() => {});
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }

        const mo = new MutationObserver(syncSlideVideos);
        slides.forEach(slide => {
            mo.observe(slide, { attributes: true, attributeFilter: ['class'] });
        });

        syncSlideVideos();
    }

    function init() {
        applyReducedMotionVideos();
        pauseOffScreenVideos();
        initCarouselVideos();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    prefersReducedMotion.addEventListener('change', applyReducedMotionVideos);
})();
