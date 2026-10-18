/**
 * Hero orb — rotating active highlight on satellite service cards
 */
(function () {
    'use strict';

    const HIGHLIGHT_INTERVAL = 2200;

    function initHeroOrbHighlight() {
        const orb = document.querySelector('.hero-tech-orb');
        if (!orb) return;

        const points = orb.querySelectorAll('.orb-data-point');
        const lines = orb.querySelectorAll('.connection-line');
        if (!points.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        orb.classList.add('orb-highlight-active');

        let currentIndex = 0;
        let timer = null;

        function setActive(index) {
            points.forEach((point, i) => {
                point.classList.toggle('is-active', i === index);
            });

            lines.forEach((line, i) => {
                line.classList.toggle('is-active', i === index);
            });

            currentIndex = index;
        }

        function advance() {
            const next = (currentIndex + 1) % points.length;
            setActive(next);
        }

        function startCycle() {
            if (timer) clearInterval(timer);
            if (prefersReducedMotion) {
                setActive(0);
                return;
            }
            setActive(0);
            timer = setInterval(advance, HIGHLIGHT_INTERVAL);
        }

        function stopCycle() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        startCycle();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopCycle();
            } else {
                startCycle();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroOrbHighlight);
    } else {
        initHeroOrbHighlight();
    }
})();
