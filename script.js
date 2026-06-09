/**
 * Shared JavaScript logic for Shritej Patil Portfolio - Hero Section Only
 */

// Initialize Lenis
const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    smoothTouch: true
});

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

document.addEventListener("DOMContentLoaded", () => {
    // GSAP register
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ========================================
    // REVEAL ENTRY ANIMATION
    // ========================================
    const bars = document.querySelectorAll(".bars-container .bar");
    if (bars.length > 0) {
        // We slide the bars up to reveal the hero section
        gsap.to(bars, {
            yPercent: -100,
            stagger: 0.1,
            duration: 0.8,
            ease: "power4.inOut",
            delay: 0.1 // tiny delay right after load
        });
    }

    // ========================================
    // PREMIUM LETTER-REVEAL HOVER
    // ========================================
    function splitTextIntoChars(text) {
        return text.split('').map(char => {
            if (char === ' ') {
                return '<span class="btn-char is-space">&nbsp;</span>';
            }
            return `<span class="btn-char">${char}</span>`;
        }).join('');
    }

    document.querySelectorAll('.btn-hover-reveal').forEach(btn => {
        const hoverText = btn.getAttribute('data-hover-text');
        if (!hoverText) return;

        const extras = [];
        btn.querySelectorAll('sup').forEach(el => {
            extras.push(el.outerHTML);
        });

        const charsHTML = splitTextIntoChars(hoverText);

        btn.innerHTML = `
            <span class="btn-text-wrapper">
                <span class="btn-text-row original-row">${charsHTML}</span>
                <span class="btn-text-row clone-row">${charsHTML}</span>
            </span>
            ${extras.join('')}
        `;
    });

    // ========================================
    // HERO MARQUEE LOGIC
    // ========================================
    const marquee = document.getElementById("hero-marquee");
    if (marquee) {
        gsap.to(marquee, {
            xPercent: -50,
            repeat: -1,
            duration: 15,
            ease: "none"
        });
    }
    // ========================================
    // SCRUBBED TEXT REVEAL ANIMATION
    // ========================================
    function wrapWordsForReveal(element) {
        const nodes = Array.from(element.childNodes);
        element.innerHTML = '';
        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.nodeValue.split(/(\s+)/);
                words.forEach(word => {
                    if (word.trim().length > 0) {
                        const span = document.createElement('span');
                        span.className = 'gsap-word';
                        span.style.opacity = '0.2';
                        span.textContent = word;
                        element.appendChild(span);
                    } else if (word.length > 0) {
                        element.appendChild(document.createTextNode(word));
                    }
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName.toLowerCase() === 'br') {
                    element.appendChild(node);
                } else {
                    const span = document.createElement('span');
                    span.className = 'gsap-word';
                    span.style.opacity = '0.2';
                    span.style.display = 'inline-block';
                    span.appendChild(node);
                    element.appendChild(span);
                }
            }
        });
    }

    document.querySelectorAll('.about-text, .inspired-text').forEach(el => {
        wrapWordsForReveal(el);
        gsap.to(el.querySelectorAll('.gsap-word'), {
            opacity: 1,
            stagger: 0.1,
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
                end: "bottom 50%",
                scrub: true
            }
        });
    });

    // ========================================
    // PROJECT PAGE ANIMATIONS
    // ========================================
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => {
        gsap.fromTo(el, { y: 100, opacity: 0 }, {
            y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" }
        });
    });

    const parallaxImgs = document.querySelectorAll(".parallax-img");
    if (parallaxImgs.length > 0) {
        gsap.to(".parallax-img", {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: ".parallax-img",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // ========================================
    // WORK PAGE HOVER REVEAL LOGIC
    // ========================================
    const workItems = document.querySelectorAll('.work-list-item');
    const revealContainer = document.getElementById('hover-reveal-container');
    const revealImg = document.getElementById('hover-reveal-img');

    if (workItems.length > 0 && revealContainer && revealImg) {
        // We use GSAP quickTo for smooth cursor following
        const xTo = gsap.quickTo(revealContainer, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(revealContainer, "y", { duration: 0.4, ease: "power3" });

        workItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const imgUrl = item.getAttribute('data-image');
                if (imgUrl) {
                    revealImg.src = imgUrl;
                }
                
                // Show container with scale and opacity
                revealContainer.classList.remove('opacity-0', 'scale-50');
                revealContainer.classList.add('opacity-100', 'scale-100');
            });

            item.addEventListener('mouseleave', () => {
                // Hide container
                revealContainer.classList.remove('opacity-100', 'scale-100');
                revealContainer.classList.add('opacity-0', 'scale-50');
            });

            item.addEventListener('mousemove', (e) => {
                // Center the image container on cursor
                // Container width is 400, height is 300 (defined in classes)
                xTo(e.clientX - 200);
                yTo(e.clientY - 150);
            });
        });
    }

    // ========================================
    // FULLSCREEN MENU LOGIC (LIQUID DROPDOWN)
    // ========================================
    const menuToggleBtn = document.getElementById('menu-toggle');
    const closeMenuBtn = document.getElementById('close-menu');
    const fullscreenMenu = document.getElementById('fullscreen-menu');
    const liquidPath = document.getElementById('liquid-path');
    const menuContent = document.getElementById('menu-content');
    
    if (menuToggleBtn && closeMenuBtn && fullscreenMenu && liquidPath) {
        const menuTimeline = gsap.timeline({ paused: true });
        
        // Ensure menu is always 'visible' but clipped to 0
        gsap.set(liquidPath, { attr: { d: "M 0 0 L 1 0 L 1 0 Q 0.5 0 0 0 Z" } });
        gsap.set(menuContent, { opacity: 0, y: 50 });
        
        // Setup liquid drop timeline
        menuTimeline
            .to(fullscreenMenu, { pointerEvents: "auto", duration: 0 })
            .to(liquidPath, {
                attr: { d: "M 0 0 L 1 0 L 1 0.7 Q 0.5 1.2 0 0.7 Z" },
                duration: 0.4,
                ease: "power2.in"
            })
            .to(liquidPath, {
                attr: { d: "M 0 0 L 1 0 L 1 1 Q 0.5 1 0 1 Z" },
                duration: 0.4,
                ease: "power2.out"
            })
            .to(menuContent, {
                opacity: 1,
                y: 0,
                pointerEvents: "auto",
                duration: 0.5,
                ease: "power3.out"
            }, "-=0.3"); // Overlap fade-in with the end of the liquid splash
        
        menuToggleBtn.addEventListener('click', () => {
            menuTimeline.play();
        });
        
        closeMenuBtn.addEventListener('click', () => {
            menuTimeline.reverse();
        });
    }

    // ========================================
    // AUDIO TOGGLE LOGIC
    // ========================================
    const audioToggle = document.getElementById('audio-toggle');
    const bgAudio = document.getElementById('bg-audio');
    const audioText = document.getElementById('audio-text');
    const audioIcon = document.getElementById('audio-icon');

    if (audioToggle && bgAudio) {
        audioToggle.addEventListener('click', () => {
            if (bgAudio.paused) {
                bgAudio.play();
                audioText.innerText = 'On';
                audioIcon.classList.add('playing');
            } else {
                bgAudio.pause();
                audioText.innerText = 'Off';
                audioIcon.classList.remove('playing');
            }
        });
    }
});
