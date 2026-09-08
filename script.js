// ==========================================================================
// "WHAT'S IN MY TRAY" THEME - EDITORIAL JOURNAL ROUTING & SCROLL ANIMATIONS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    const trayPills = document.querySelectorAll('.tray-pill');
    const homeView = document.getElementById('homeView');
    const pagesContainer = document.getElementById('pagesContainer');
    const heroPosterWrapper = document.getElementById('heroPosterWrapper');

    // AUTOMATIC FLY-IN ONTO METALLIC TRAY ON LOAD
    function triggerFlyInAnimation() {
        const delays = [150, 400, 650, 900, 1150, 1400];

        trayPills.forEach((pill, index) => {
            pill.classList.remove('animate-fly-in', 'fly-in-done');
            
            setTimeout(() => {
                pill.classList.add('animate-fly-in');

                setTimeout(() => {
                    pill.classList.add('fly-in-done');
                }, 1600);
            }, delays[index] || index * 250);
        });
    }

    // Run automatically on page load
    triggerFlyInAnimation();

    // INTERSECTION OBSERVER FOR SCROLL REVEALING STORY BLOCKS
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        scrollObserver.observe(el);
    });

    // SCROLL PARALLAX TRANSITION FOR HERO POSTER IMAGE
    function handleScrollTransition() {
        if (!pagesContainer.classList.contains('active')) return;
        
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        
        if (heroPosterWrapper) {
            const opacity = Math.max(0, 1 - scrollTop / 280);
            const translateY = -(scrollTop * 0.22);
            const scale = Math.max(0.88, 1 - scrollTop / 1800);

            heroPosterWrapper.style.opacity = opacity.toFixed(3);
            heroPosterWrapper.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        }
    }

    window.addEventListener('scroll', handleScrollTransition, { passive: true });

    // ROUTING TO SUBPAGES
    function openSubpage(targetPageId) {
        const targetPage = document.getElementById(targetPageId);
        if (!targetPage) return;

        homeView.classList.remove('active-view');
        pagesContainer.classList.add('active');

        document.querySelectorAll('.subpage').forEach(page => {
            page.classList.toggle('active-page', page.id === targetPageId);
        });

        window.scrollTo({ top: 0, behavior: 'instant' });
        if (heroPosterWrapper) {
            heroPosterWrapper.style.opacity = '1';
            heroPosterWrapper.style.transform = 'none';
        }

        setTimeout(() => {
            document.querySelectorAll('.scroll-reveal').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('revealed');
                }
            });
        }, 100);
    }

    function returnToTray() {
        pagesContainer.classList.remove('active');
        homeView.classList.add('active-view');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.addEventListener('click', (event) => {
        const clickEl = event.target.nodeType === 1 ? event.target : event.target.parentElement;
        if (!clickEl || typeof clickEl.closest !== 'function') return;

        const homeTrigger = clickEl.closest('#globalHomeBtn');
        if (homeTrigger) {
            returnToTray();
            return;
        }

        const trigger = clickEl.closest('[data-target]');
        if (!trigger) return;

        const href = trigger.getAttribute('href') || '';
        if (href.startsWith('http')) return;

        const targetId = trigger.getAttribute('data-target');
        if (!targetId) return;

        event.preventDefault();
        openSubpage(targetId);
    });

});
